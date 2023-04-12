FROM wonderlic/node:16-alpine-builder as base

WORKDIR /

COPY .npmrc package.json pnpm-lock.yaml ./
RUN pnpm install --no-optional

#---------------------------------------------------------------------
FROM base as stage

RUN pnpm install --no-optional --prod

#---------------------------------------------------------------------
FROM base as build

COPY . ./
COPY env /env


CMD ["/", "/index.js"]
