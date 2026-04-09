# Használjuk a könnyűsúlyú Node.js 18-as verziót
FROM node:18-alpine

# Munkakönyvtár létrehozása
WORKDIR /app

# Függőségek telepítése
COPY package*.json ./
RUN npm install

# Teljes forráskód átmásolása
COPY . .

# A React alapértelmezett portja
EXPOSE 3000

# React szerver indítása
CMD ["npm", "start"]