###############
# build stage #
###############

FROM node:20 AS build

WORKDIR /

COPY package.json yarn.lock tsconfig.json ./

# installs both production and dev dependencies
RUN yarn install

RUN yarn build

###############
# final stage #
###############

FROM node:20


COPY package.json yarn.lock ./

# installs only production dependencies
RUN yarn install

# wherever your tsc build output is
COPY --from=build ./build ./build

USER node