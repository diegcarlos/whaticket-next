FROM node:18

ENV PORT 3000

# Cria o app diretorio
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# instala dependencias
COPY package*.json /usr/src/app/
RUN yarn install

# Copia as dependencias ara diretorio
COPY . /usr/src/app

# Building app
RUN yarn run build
EXPOSE 3000

# Running the app
CMD "yarn" "run" "dev"