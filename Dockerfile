FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 3000

VOLUME /app

CMD ["node", "dist/main.js"]