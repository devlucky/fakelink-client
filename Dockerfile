FROM node:6.3
RUN mkdir -p /app
RUN mkdir -p /app/build
WORKDIR /app
COPY package.json ./package.json
RUN npm i
ADD ./src /app/src
ADD ./build /app/build
EXPOSE 3000
CMD ["npm", "start"]