from flask import Flask, jsonify, request,  redirect, url_for, session,send_file
import pyrebase
import tensorflow as tf
import numpy as np
import PIL.Image
import os
import json
from datetime import datetime
from flask_cors import CORS
#from flask import request

#
# from firebase_admin import auth


app = Flask(__name__)

CORS(app,supports_credentials=True)

app.secret_key = os.urandom(24).hex()  # Set a secret key for session management



# Enable CORS for all routes


firebaseConfig = {
    }


firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db=firebase.database()
storage = firebase.storage()


SESSION_FILE = 'session.json'

def save_session_to_file(session_data):
    with open(SESSION_FILE, 'w') as file:
        json.dump(session_data, file)

def load_session_from_file():
    try:
        with open(SESSION_FILE, 'r') as file:
            session_data = json.load(file)
            return session_data
    except FileNotFoundError:
        return {}

def clear_session_file():
    with open(SESSION_FILE, 'w') as file:
        json.dump({}, file)
    
def get_current_datetime():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")

# Load pre-trained model
def load_model():
    content_layers = ['block5_conv2']
    style_layers = ['block1_conv1', 'block2_conv1', 'block3_conv1', 'block4_conv1', 'block5_conv1']
    vgg = tf.keras.applications.VGG19(include_top=False, weights='vgg19_weights_tf_dim_ordering_tf_kernels_notop.h5')
    vgg.trainable = False

    style_extractor = vgg_layers(style_layers)
    extractor = StyleContentModel(style_layers, content_layers)

    return extractor

def vgg_layers(layer_names):
    vgg = tf.keras.applications.VGG19(include_top=False, weights='vgg19_weights_tf_dim_ordering_tf_kernels_notop.h5')
    vgg.trainable = False
    outputs = [vgg.get_layer(name).output for name in layer_names]
    model = tf.keras.Model([vgg.input], outputs)
    return model

class StyleContentModel(tf.keras.models.Model):
    def __init__(self, style_layers, content_layers):
        super(StyleContentModel, self).__init__()
        self.vgg = vgg_layers(style_layers + content_layers)
        self.style_layers = style_layers
        self.content_layers = content_layers
        self.num_style_layers = len(style_layers)
        self.vgg.trainable = False

    def call(self, inputs):
        inputs = inputs * 255.0
        preprocessed_input = tf.keras.applications.vgg19.preprocess_input(inputs)
        outputs = self.vgg(preprocessed_input)
        style_outputs, content_outputs = (outputs[:self.num_style_layers], outputs[self.num_style_layers:])
        style_outputs = [gram_matrix(style_output) for style_output in style_outputs]
        content_dict = {content_name: value for content_name, value in zip(self.content_layers, content_outputs)}
        style_dict = {style_name: value for style_name, value in zip(self.style_layers, style_outputs)}
        return {'content': content_dict, 'style': style_dict}

def gram_matrix(input_tensor):
    result = tf.linalg.einsum('bijc,bijd->bcd', input_tensor, input_tensor)
    input_shape = tf.shape(input_tensor)
    num_locations = tf.cast(input_shape[1] * input_shape[2], tf.float32)
    return result / (num_locations)

def load_img(path_to_img):
    max_dim = 512
    img = tf.io.read_file(path_to_img)
    img = tf.image.decode_image(img, channels=3)
    img = tf.image.convert_image_dtype(img, tf.float32)

    shape = tf.cast(tf.shape(img)[:-1], tf.float32)
    long_dim = max(shape)
    scale = max_dim / long_dim

    new_shape = tf.cast(shape * scale, tf.int32)

    img = tf.image.resize(img, new_shape)
    img = img[tf.newaxis, :]
    return img

def style_transfer(content_image_path, style_image_path, output_path, epochs, steps_per_epoch):
    content_image = load_img(content_image_path)
    style_image = load_img(style_image_path)

    extractor = load_model()
    style_targets = extractor(style_image)['style']
    content_targets = extractor(content_image)['content']

    image = tf.Variable(content_image)

    opt = tf.keras.optimizers.Adam(learning_rate=0.02, beta_1=0.99, epsilon=1e-1)
    style_weight = 1e-2
    content_weight = 1e4

    @tf.function()
    def train_step(image):
        with tf.GradientTape() as tape:
            outputs = extractor(image)
            loss = style_content_loss(outputs)

        grad = tape.gradient(loss, image)
        opt.apply_gradients([(grad, image)])
        image.assign(clip_0_1(image))

   


    def style_content_loss(outputs):
        style_outputs = outputs['style']
        content_outputs = outputs['content']
        style_loss = tf.add_n([tf.reduce_mean((style_outputs[name] - style_targets[name]) ** 2) for name in style_outputs.keys()])
        style_loss *= style_weight / len(style_outputs)

        content_loss = tf.add_n([tf.reduce_mean((content_outputs[name] - content_targets[name]) ** 2) for name in content_outputs.keys()])
        content_loss *= content_weight / len(content_outputs)

        loss = style_loss + content_loss
        return loss

    def clip_0_1(image):
        return tf.clip_by_value(image, clip_value_min=0.0, clip_value_max=1.0)

    for _ in range(epochs):
        for _ in range(steps_per_epoch):
            train_step(image)

    generated_image_array = np.array(image[0].numpy() * 255, dtype=np.uint8)
    generated_image_pil = PIL.Image.fromarray(generated_image_array)
    generated_image_pil.save(output_path)


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    if data:
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        if name and email and password:
            try:
                user = auth.create_user_with_email_and_password(email, password,)
                # Save user data to Firebase Realtime Database
                user_data = {
                    'name': name,
                    'email': email
                    # You can add more user data fields here if needed
                }
                db.child('users').child(user['localId']).set(user_data)
                auth.send_email_verification(user['idToken'])
                session['user'] = user
                print(user)
                print("&&&&&")
                print(session["user"]["localId"])
                save_session_to_file(session)
                return jsonify({'success': True, 'message': 'User created successfully'}), 200
            except:
                return jsonify({'success': False, 'error': 'Email already exists'}), 400
        else:
            return jsonify({'success': False, 'error': 'Invalid data'}), 400
    else:
        return jsonify({'success': False, 'error': 'No data provided'}), 400



@app.route('/login', methods=['POST'])
def login():
    

    if request.method == 'POST':
        email = request.json.get('email')
        password = request.json.get('password')
        try:
            
            user = auth.sign_in_with_email_and_password(email, password)
            session['user'] = user
            print(user)
            print("&&&&&")
            print(session["user"]["localId"])
            save_session_to_file(session)
            
            
            return jsonify({'success': True, 'message': 'Login successful'})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 200  
    return jsonify({'success': False, 'error': 'Method not allowed'}), 405  # Method Not Allowed status code


@app.route('/reset_password', methods=['POST'])
def reset_password():
    email = request.json.get('email')

    if not email:
        return jsonify({'error': 'Email address is required'}), 400

    try:
        reset_email = auth.send_password_reset_email(email)
        return jsonify({'message': 'Password reset email sent successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/signout', methods=['GET'])
def signout():
    clear_session_file()
    return jsonify({'success': True, 'message': 'User signed out successfully'}), 200





@app.route('/user_info', methods=['GET'])
def user_info():
    session = load_session_from_file()
    if 'user' not in session:
        return jsonify({'error': 'User not logged in'}), 401  # Unauthorized

    user_id = session['user']['localId']

    try:
        user_data = db.child('users').child(user_id).get().val()
        if user_data:
            name = user_data.get('name')
            email = user_data.get('email')
            if name and email:
                return jsonify({'name': name, 'email': email}), 200
            else:
                return jsonify({'error': 'Name or email not found for the user'}), 500
        else:
            return jsonify({'error': 'User data not found'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/change_name', methods=['POST'])
def change_name():
    session = load_session_from_file()
    if 'user' not in session:
        return jsonify({'error': 'User not logged in'}), 401  # Unauthorized

    user_id = session['user']['localId']
    data = request.json
    if data:
        new_name = data.get('new_name')
        if new_name:
            try:
                db.child("users").child(user_id).update({"name": new_name})
                return jsonify({'success': True, 'message': 'Name updated successfully'}), 200
            except Exception as e:
                return jsonify({'success': False, 'error': str(e)}), 500
        else:
            return jsonify({'success': False, 'error': 'New name not provided'}), 400
    else:
        return jsonify({'success': False, 'error': 'No data provided'}), 400


@app.route('/delete_user', methods=['DELETE'])
def delete_user():
    session = load_session_from_file()
    if 'user' not in session:
        return jsonify({'error': 'User not logged in'}), 401  # Unauthorized

    user_id = session['user']['localId']

    try:
        auth.delete_user_account(user_id)
        db.child("users").child(user_id).remove()
        session.pop('user')  # Remove user session data after deletion
        return jsonify({'success': True, 'message': 'User deleted successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500




@app.route('/session_check', methods=['GET', 'POST'])
def sessioning():
    session = load_session_from_file()
    if 'user' not in session:
        return jsonify({'success': False, 'error': 'Invalid data'})
    else:
        return jsonify({'success': True}), 200



@app.route('/transfer_style', methods=['GET', 'POST'])
def transfer_style():
    session = load_session_from_file()
    if 'user' not in session:
        return jsonify({'success': False, 'error': 'Invalid data'}), 400
      


    if request.method == 'POST':
        print("jofdojfdjjdovjdovjodjvdjnvjjjjjjjjjjjjjj")
        """current_session = session._get_current_object() 
        print(session["user"]["localId"])
        user_id = current_session.get('user')
        print(user_id)"""

        #user_id = session['localId']
        user_id = session["user"]["localId"]   #session does not get passed to here
        print(user_id)   #no data avilable

        
        
        style_file = request.files['style']
        content_file = request.files['content']
        
        epochs = int(request.form.get('epochs', 1))
        steps_per_epoch = int(request.form.get('steps_per_epoch', 5))

        content_filename = 'contentpic.jpg'
        style_filename = 'stylepic.jpg'
        output_filename = 'generated_image.jpg'

        content_path = os.path.join('content', content_filename)
        style_path = os.path.join('style', style_filename)
        output_path = os.path.join('generated', output_filename)

        content_file.save(content_path)
        style_file.save(style_path)

        style_transfer(content_path, style_path, output_path, epochs, steps_per_epoch)
        time = get_current_datetime()

       # Store URLs in Firebase Realtime Database
        content_upload = storage.child('content').child(f'content_{user_id}-{time}').put(content_path)
        content_url = storage.child('content').child(f'content_{user_id}-{time}').get_url(content_upload['downloadTokens'])

        style_upload = storage.child('style').child(f'style_{user_id}-{time}').put(style_path)
        style_url = storage.child('style').child(f'style_{user_id}-{time}').get_url(style_upload['downloadTokens'])

        generated_upload = storage.child('generated').child(f'generated_{user_id}-{time}').put(output_path)
        generated_url = storage.child('generated').child(f'generated_{user_id}-{time}').get_url(generated_upload['downloadTokens'])

        # Store URLs in the database
        db.child('users').child(user_id).child("Images").push({
            "content": content_url,
            "style": style_url,
            "generated": generated_url
        })
        return jsonify({'result': 'success', 'generated_image': output_filename})


@app.route('/transfer_style_logged_out', methods=['GET', 'POST'])
def transfer_style_logged_out():
      
    if request.method == 'POST':
       
        style_file = request.files['style']
        content_file = request.files['content']
        
        epochs = int(request.form.get('epochs', 1))
        steps_per_epoch = int(request.form.get('steps_per_epoch', 5))

        content_filename = 'contentpic.jpg'
        style_filename = 'stylepic.jpg'
        output_filename = 'generated_image.jpg'

        content_path = os.path.join('content', content_filename)
        style_path = os.path.join('style', style_filename)
        output_path = os.path.join('generated', output_filename)

        content_file.save(content_path)
        style_file.save(style_path)

        style_transfer(content_path, style_path, output_path, epochs, steps_per_epoch)

        return jsonify({'result': 'success', 'generated_image': output_filename})

@app.route('/get_user_images', methods=['GET'])
def get_user_images():
    session = load_session_from_file()
    if 'user' not in session:
        return jsonify({'success': False, 'error': 'Invalid data'}), 400

    user_id = session["user"]["localId"]

    # Retrieve user's images from the database
    user_images = db.child('users').child(user_id).child("Images").get()
    
    images_data = {}
    # Prepare JSON response
    if user_images:
        for image_key in user_images.each():  # Iterate over each child node
            images_data[image_key.key()] = image_key.val()
    
   
    return jsonify(images_data)
@app.route('/reference_images', methods=['GET'])
def get_images():
    # Retrieve all images URLs from the database
    images_data = db.child("reference_images").get().val()
    if images_data:
        images_urls = {"image_{}".format(idx + 1): image_data["url"] for idx, image_data in enumerate(images_data.values())}
        return jsonify(images_urls)
    else:
        return jsonify({"message": "No images found"}), 404

@app.route('/generated_image/<path:image_name>')
def get_generated_image(image_name):
    generated_image_path = os.path.join('generated', image_name)
    if os.path.exists(generated_image_path):
        return send_file(generated_image_path, mimetype='image/jpeg')
    else:
        return jsonify({'message': 'Image not yet generated. Please wait for the process to complete.'})
if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)


