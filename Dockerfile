# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.1.4-alpine AS base

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
# install with --production (exclude devDependencies)
RUN cd /temp/prod && bun install --frozen-lockfile --production


# final image
FROM base AS release

RUN apk add -q --progress --update --no-cache dumb-init

WORKDIR /usr/src/app
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

# run the app
USER bun
ENV NODE_ENV=production
ENTRYPOINT [ "dumb-init" ]
CMD [ "bun", "src/index.ts" ]
