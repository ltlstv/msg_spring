ARG NODE_VERSION=22.3.23=alpine

FROM node:22-alpine3.23

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN chown -R node:node /app

USER node

EXPOSE 5500

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]