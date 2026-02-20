# Stage 1 - the build process
FROM node:17.8-buster as build-deps
WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build --production

# Stage 2 - the production environment
FROM nginx:1.15.8-alpine
COPY --from=build-deps /usr/src/app/dist /usr/share/nginx/html
COPY resources/config/nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx && \
    touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid
EXPOSE 8080
USER nginx
CMD ["nginx", "-g", "daemon off;"]