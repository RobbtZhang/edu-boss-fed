FROM nginx
LABEL name="edu"
LABEL version="1.0"
COPY ./dist /usr/share/nginx/html
COPY ./vue-edu.conf /etc/nginx/conf.d
EXPOSE 80
