# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

# Set up the working directory in the container
WORKDIR /app

# Copy the application code into the container
COPY . /app

# Install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Copy the VGG19 weights file
COPY vgg19_weights_tf_dim_ordering_tf_kernels_notop.h5 /app/vgg19_weights_tf_dim_ordering_tf_kernels_notop.h5

# Copy additional directories
COPY nst_backend /app/nst_backend
COPY style /app/style
COPY styleimages_references /app/styleimages_references
COPY templates /app/templates
COPY generated /app/generated
COPY content /app/content

# Expose the port on which the Flask app will run
EXPOSE 5000

# Command to run the Flask application
CMD ["flask", "run"]
