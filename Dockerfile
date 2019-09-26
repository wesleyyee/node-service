FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./
COPY src ./src
COPY tsconfig.json ./

RUN yarn
RUN yarn build
COPY . .
RUN cat /usr/src/app/knexfile.js

EXPOSE 8080
CMD [ "node", "lib/app.js" ]