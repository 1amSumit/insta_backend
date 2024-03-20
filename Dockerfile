FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY config.env .

ENV NODE_ENV production

COPY ./ ./

ENV PORT=8080

CMD npm start
