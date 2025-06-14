FROM node:18-alpine

WORKDIR /app

# Instalar dependencias de OpenSSL
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# Ejecutar migraciones y luego iniciar la aplicación
CMD npx prisma migrate deploy && npm run start:prod 