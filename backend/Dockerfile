FROM python:3.12-slim

ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

WORKDIR /app


COPY . /app

COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

COPY vgg19_weights_tf_dim_ordering_tf_kernels_notop.h5 /app/vgg19_weights_tf_dim_ordering_tf_kernels_notop.h5

COPY style /app/style
COPY styleimages_references /app/styleimages_references
COPY session.json /app/session.json
COPY generated /app/generated
COPY content /app/content

EXPOSE 5000

CMD ["flask", "run"]
