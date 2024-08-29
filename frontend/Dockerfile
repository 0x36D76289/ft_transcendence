FROM nginx:alpine

RUN mkdir -p ./frontend/certs \
	&& openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./frontend/certs/nginx-selfsigned.key -out ./frontend/certs/nginx-selfsigned.crt

COPY . /usr/share/nginx/html