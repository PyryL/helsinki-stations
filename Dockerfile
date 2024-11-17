FROM node:22-alpine AS build

WORKDIR /usr/src/app

ADD package.json .
ADD package-lock.json .

RUN npm install --no-fund

ADD src/ src/
ADD public/ public/
ADD vite.config.js .
ADD index.html .

RUN npm run build



FROM node:22-alpine

WORKDIR /usr/src/app

RUN npm install --no-save --no-fund http-server@14

COPY --from=build /usr/src/app/dist/ dist/

USER node

EXPOSE 8080

# TODO: tls
CMD [ "npx", "http-server", "dist/", "--gzip", "--utc", "--log-ip", "--no-dotfiles", "-d", "false" ]