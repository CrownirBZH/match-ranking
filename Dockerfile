# Stage 1: Build
FROM node:22.12.0-bullseye-slim AS builder

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=node:node . .

RUN yarn install --frozen-lockfile --production

RUN yarn build

# Stage 2: Production
FROM node:22.12.0-bullseye-slim AS production

WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Europe/Paris

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/public ./public

# DEBUG
COPY --chown=node:node --from=builder /app/.env ./.env

EXPOSE 3000

CMD ["node", "dist/main.js"]