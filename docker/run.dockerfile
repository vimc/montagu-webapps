FROM nginx:1.13

ARG APP_NAME

COPY app/out/$APP_NAME /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/nginx.default.conf /etc/nginx/conf.d/default.conf

ENV MONTAGU_PORTAL_PROFILE docker
