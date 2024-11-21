FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf

RUN apt-get update && apt-get install -y nginx openssl \
	&& mkdir -p /etc/nginx/ssl \
	&& openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/ssl/nginx-selfsigned.key -out /etc/nginx/ssl/nginx-selfsigned.crt -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42"
