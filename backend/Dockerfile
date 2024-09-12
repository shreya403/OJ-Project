FROM node:18-alpine

#Working directory
WORKDIR /app

RUN apk add --update python3
RUN apk update && apk add --no-cache g++

COPY package*.json ./
RUN npm install
COPY . .

ARG MONGO_URL=""
ARG SUBMISSION_PORT=""

ENV MONGO_URL=${MONGO_URL}
ENV SUBMISSION_PORT=${SUBMISSION_PORT}

EXPOSE 4000

CMD [ "npm", "run", "dev"]
