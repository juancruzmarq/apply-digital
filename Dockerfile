FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate && \
    npm install -g ts-node && \
    npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=base /app/package*.json ./

COPY --from=base /app/dist ./dist 
COPY --from=base /app/node_modules ./node_modules

COPY --from=base /app/tsconfig.json ./tsconfig.json
COPY --from=base /app/tsconfig.build.json ./tsconfig.build.json
COPY --from=base /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:api:prod"]
