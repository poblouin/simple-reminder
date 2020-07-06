FROM node:lts-slim as develop-stage
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm ci --silent
COPY --chown=node:node . .

# build stage
FROM arm64v8/node:lts-slim as production-stage
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
USER node
RUN npm ci --silent
COPY --chown=node:node . .
RUN npm run build
COPY --chown=node:node ./dist .
CMD ["npm", "run", "start"]

