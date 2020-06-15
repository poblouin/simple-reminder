FROM node:lts-alpine as develop-stage
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm ci --silent
COPY --chown=node:node . .

# build stage
FROM develop-stage as build-stage
RUN npm run build
COPY --chown=node:node ./dist .

