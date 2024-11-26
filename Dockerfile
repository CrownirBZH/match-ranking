# Stage 1: Build
FROM node:20.18.0-bullseye-slim AS builder

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --chown=node:node . .

RUN yarn build

# Stage 2: Production
FROM node:20.18.0-bullseye-slim AS production

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/public ./public

# DEBUG
COPY --chown=node:node --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["node", "dist/main.js"]