FROM node:18 as build-deps

ENV PORT 3333

# Cria o app diretorio
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# instala dependencias
COPY package*.json /usr/src/app/
RUN yarn install

# Copia as dependencias para diretorio
COPY . /usr/src/app

# Building app
RUN yarn run build
EXPOSE 3333

ENTRYPOINT ["dumb-init", "--"]
CMD dockerize -wait tcp://${DB_HOST}:3306 \
  && npx sequelize db:migrate \
  && yarn dist/server.js
