FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY config.env .

COPY src/ src/

ENV PORT=8080

CMD [ "npm", "start" ]
