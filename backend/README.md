
---

# Neural Style Transfer API - backend

This Flask API allows users to perform neural style transfer on images. Users can sign up, log in, upload content and style images, and generate new images using a pre-trained neural style transfer model. Additionally, users can retrieve their generated images and reference images stored in the database.

## Endpoints

### User Management

#### 1. Sign Up
- **Endpoint:** `/signup`
- **Method:** POST
- **Request Body:** JSON
  ```json
  {
      "name": "Your Name",
      "email": "your.email@example.com",
      "password": "YourPassword"
  }
  ```
- **Response:** JSON
  - Success:
    ```json
    {
        "success": true,
        "message": "User created successfully"
    }
    ```
  - Error:
    ```json
    {
        "success": false,
        "error": "Error message"
    }
    ```

#### 2. Login
- **Endpoint:** `/login`
- **Method:** POST
- **Request Body:** JSON
  ```json
  {
      "email": "your.email@example.com",
      "password": "YourPassword"
  }
  ```
- **Response:** JSON
  - Success:
    ```json
    {
        "success": true,
        "message": "Login successful"
    }
    ```
  - Error:
    ```json
    {
        "success": false,
        "error": "Error message"
    }
    ```

#### 3. Reset Password
- **Endpoint:** `/reset_password`
- **Method:** POST
- **Request Body:** JSON
  ```json
  {
      "email": "your.email@example.com"
  }
  ```
- **Response:** JSON
  - Success:
    ```json
    {
        "message": "Password reset email sent successfully"
    }
    ```
  - Error:
    ```json
    {
        "error": "Error message"
    }
    ```

#### 4. Sign Out
- **Endpoint:** `/signout`
- **Method:** GET
- **Response:** JSON
  - Success:
    ```json
    {
        "success": true,
        "message": "User signed out successfully"
    }
    ```
  - Error:
    ```json
    {
        "error": "Error message"
    }
    ```

### Image Processing

#### 5. Transfer Style (Logged In)
- **Endpoint:** `/transfer_style`
- **Method:** POST
- **Request Body:** Form Data
  - `style`: Style image file
  - `content`: Content image file
  - `epochs`: Number of epochs for training (optional, default is 1)
  - `steps_per_epoch`: Steps per epoch (optional, default is 5)
- **Response:** JSON
  - Success:
    ```json
    {
        "result": "success",
        "generated_image": "generated_image.jpg"
    }
    ```
  - Error:
    ```json
    {
        "success": false,
        "error": "Error message"
    }
    ```

#### 6. Transfer Style (Logged Out)
- **Endpoint:** `/transfer_style_logged_out`
- **Method:** POST
- **Request Body:** Form Data
  - `style`: Style image file
  - `content`: Content image file
  - `epochs`: Number of epochs for training (optional, default is 1)
  - `steps_per_epoch`: Steps per epoch (optional, default is 5)
- **Response:** JSON
  - Success:
    ```json
    {
        "result": "success",
        "generated_image": "generated_image.jpg"
    }
    ```
  - Error:
    ```json
    {
        "success": false,
        "error": "Error message"
    }
    ```

#### 7. Get User Images
- **Endpoint:** `/get_user_images`
- **Method:** GET
- **Response:** JSON containing URLs of user's generated images

#### 8. Get Reference Images
- **Endpoint:** `/reference_images`
- **Method:** GET
- **Response:** JSON containing URLs of reference images stored in the database

#### 9. Get Generated Image
- **Endpoint:** `/generated_image/<image_name>`
- **Method:** GET
- **Response:** Returns the generated image file

## How to Use

1. **Sign Up:** Register a new account using the `/signup` endpoint.
2. **Log In:** Log in using the `/login` endpoint.
3. **Upload Images:** Use the `/transfer_style` endpoint to perform neural style transfer. Upload both style and content images along with optional parameters.
4. **Retrieve Generated Images:** Use the `/get_user_images` endpoint to retrieve generated images associated with the logged-in user.
5. **Log Out:** Use the `/signout` endpoint to log out.

---


### VGG19 Algorithm and Implementation using TensorFlow

#### Overview
VGG19 is a convolutional neural network architecture proposed by the Visual Geometry Group at the University of Oxford. It is widely used for image classification and feature extraction tasks. VGG19 consists of 19 layers, including 16 convolutional layers and 3 fully connected layers.

#### Implementation using TensorFlow
In the provided Flask application, VGG19 is implemented using TensorFlow for style transfer. Here's a brief overview of its implementation:

1. **Model Loading:** The VGG19 model is loaded using TensorFlow's `tf.keras.applications.VGG19` module.
2. **Preprocessing:** Images are preprocessed using VGG19's `preprocess_input` function to ensure compatibility with the model.
3. **Style Transfer:** The style transfer process involves extracting features from both the style and content images using specific layers of the VGG19 model.
4. **Loss Calculation:** Style loss and content loss are calculated based on the features extracted from the style and content images.
5. **Optimization:** An Adam optimizer is used to minimize the combined loss function, resulting in the generation of a new image that combines the content of the content image with the style of the style image.

This implementation allows users to perform neural style transfer by providing style and content images, along with optional parameters for training epochs and steps per epoch. The generated image is then returned as output, which users can retrieve using the appropriate endpoints.