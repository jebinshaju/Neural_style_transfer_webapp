
---

# Neural Style Transfer Web Application

This project consists of a web application built with React for the frontend and Flask for the backend. The application allows users to perform neural style transfer on images, where the style of one image is applied to the content of another image to generate visually appealing results.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Docker](#docker)
- [Endpoints](#endpoints)
- [VGG19 Algorithm](#vgg19-algorithm)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Neural style transfer is a technique in deep learning that allows for the transfer of artistic styles from one image to another. This project provides a user-friendly interface for users to upload their content and style images, and then generate new images combining the content of the content image with the style of the style image.

## Features

- User Authentication: Users can sign up and log in securely to access the style transfer functionality.
- Image Upload: Users can upload both content and style images for style transfer.
- Style Transfer: The application performs neural style transfer using a pre-trained model.
- Generated Image Retrieval: Users can retrieve the generated images for reference or download.

## Technologies Used

- **Frontend**: React.js, React Router, HTML, CSS
- **Backend**: Flask, TensorFlow, NumPy
- **Database**: SQLite (for user authentication and storing image URLs)
- **Deployment**: Docker, Heroku (or any other suitable platform)

## Installation

To run this application locally, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/jebinshaju/Neural_style_transfer_webapp.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Neural_style_transfer_webapp
   ```

3. Install the frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Install the backend dependencies:

   ```bash
   cd ../backend
   pip install -r requirements.txt
   ```

5. Start the frontend and backend servers:

   ```bash
   # In the frontend directory
   npm start

   # In the backend directory
   flask run
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your web browser to access the application.

## Usage

Once the application is running, users can perform the following actions:

1. **Sign Up**: Register a new account using the provided form.
2. **Log In**: Log in with the registered credentials to access the style transfer functionality.
3. **Upload Images**: Upload both content and style images for style transfer.
4. **Generate Images**: Initiate the style transfer process to generate new images.
5. **Retrieve Images**: View and download the generated images from the application.

## Docker

The backend of this project is available as a Docker image on [Docker Hub](https://hub.docker.com/repository/docker/jebinshaju/neuralstyletransfer_api). To run the backend using Docker, simply pull the image and run it:

```bash
docker pull jebinshaju/neuralstyletransfer_api
docker run -p 5000:5000 jebinshaju/neuralstyletransfer_api
```

## Endpoints

The backend provides the following endpoints for performing style transfer and user management:

- `/signup`: Sign up a new user.
- `/login`: Log in an existing user.
- `/logout`: Log out the current user.
- `/transfer_style`: Perform style transfer for logged-in users.
- `/get_generated_images`: Retrieve generated images for the current user.

## VGG19 Algorithm

The VGG19 algorithm is used for neural style transfer in this project. It consists of a convolutional neural network architecture proposed by the Visual Geometry Group at the University of Oxford. VGG19 is implemented using TensorFlow for feature extraction and loss calculation during the style transfer process.

## File Structure

The project structure is organized as follows:

- **frontend/**: Contains the React frontend application.
- **backend/**: Contains the Flask backend application.


## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository and create your branch from `main`.
2. Make your changes and ensure the code is well-documented.
3. Test your changes thoroughly.
4. Create a pull request with a clear description of your changes.

## License

This project is licensed under the [MIT License](LICENSE).

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



