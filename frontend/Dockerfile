FROM nginx:alpine

# remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# Replace dev config with prod config
RUN mv /usr/share/nginx/html/assets/js/config/config.prod.js /usr/share/nginx/html/assets/js/config/config.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
