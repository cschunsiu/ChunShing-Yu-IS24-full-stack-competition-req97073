FROM node:lts-alpine AS client
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY server/package*.json ./
COPY --from=client /app client
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "server/server.js" ]