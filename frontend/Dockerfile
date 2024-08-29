FROM nginx:alpine

COPY . /usr/share/nginx/html

RUN mkdir /usr/share/nginx/html/uploads
RUN mkdir /certs

COPY nginx.conf /etc/nginx/conf.d/

RUN apk add openssl
RUN mkdir -p /etc/nginx/certs/
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/nginx/certs/nginx-selfsigned.key -out /etc/nginx/certs/nginx-selfsigned.crt -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42"

CMD ["nginx", "-g", "daemon off;"]