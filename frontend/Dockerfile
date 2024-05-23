FROM node:18-alpine AS base

RUN apk add --no-cache libc6-compat
RUN npm i -g npm

EXPOSE 3000

ENV PORT 3000
ENV NODE_ENV production

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install --omit=optional
RUN npx browserslist@latest --update-db
RUN npx next telemetry disable

# need to install linux specific swc builds
RUN npm install -D @swc/cli @swc/core

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
