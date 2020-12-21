FROM nginx
WORKDIR /root
LABEL name="edu"
LABEL version="1.0"
ADD ./dist /usr/share/nginx/html
ADD ./conf.d /etc/nginx/conf.d
EXPOSE 80
