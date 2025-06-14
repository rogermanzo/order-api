FROM node:18

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Limpiar y construir
RUN rm -rf dist/
RUN npm run build

# Verificar que los archivos compilados existen
RUN ls -la dist/

CMD npx prisma migrate deploy && npm run start:prod 