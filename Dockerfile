# Usa una imagen base de Node.js
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

ENV DATABASE_URL:postgres://kevin:1234@db:5432/integradora?scheme=public

RUN npm run build
# Expone el puerto que tu aplicación usa
EXPOSE 3005

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "npx prisma migrate deploy && npm start", "npm", "start"]