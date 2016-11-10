FROM node:6.3
MAINTAINER @zzarcon
RUN mkdir -p /app
RUN mkdir -p /app/build
WORKDIR /app
COPY package.json ./package.json
RUN npm i
ADD ./src /app/src
ADD ./build /app/build
RUN npm build
RUN ls /app/build

# Caddy server
RUN curl -sLO https://github.com/mholt/caddy/releases/download/v0.9.3/caddy_linux_amd64.tar.gz && \
  tar -xzvf caddy_linux_amd64.tar.gz caddy_linux_amd64 && \
  mv caddy_linux_amd64 /usr/bin/caddy && \
  chmod 755 /usr/bin/caddy && \
  rm -rf caddy_linux_amd64.tar.gz
RUN ln -s /app/build /var/www
RUN ls /var/www
COPY etc/Caddyfile /var/www/Caddyfile
WORKDIR /var/www
EXPOSE 80
CMD caddy