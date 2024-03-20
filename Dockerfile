FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY config.env .

COPY ./ ./

ENV PORT=8080

CMD [ "npm", "start" ]
