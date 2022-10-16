FROM node:16-alpine AS deps

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
# set work directory
WORKDIR /usr/src
# copy over package.json and yarn.lock files
COPY package.json yarn.lock .npmrc ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /usr/src
COPY . .
COPY --from=deps /usr/src/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /usr/src

ENV NODE_ENV production

COPY --from=builder /usr/src/.env ./.env
COPY --from=builder /usr/src/dist ./dist
COPY --from=builder /usr/src/node_modules ./node_modules
COPY --from=builder /usr/src/package.json ./package.json

RUN addgroup -g 1001 -S api
RUN adduser -S api -u 1001
RUN chown -R api:api /usr/src/dist
USER api

EXPOSE 8000

CMD ["yarn", "start"]
