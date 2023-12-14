###############
# build stage #
###############

FROM node:16-alpine AS build

ARG NODE_ENV="development"

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

# installs both production and dev dependencies
RUN yarn install

RUN yarn run build

###############
# final stage #
###############

FROM node:16-alpine

ARG NODE_ENV="production"

COPY package.json yarn.lock ./

# installs only production dependencies
RUN yarn install

# wherever your tsc build output is
COPY --from=build ./build ./build

USER node

CMD yarn run start