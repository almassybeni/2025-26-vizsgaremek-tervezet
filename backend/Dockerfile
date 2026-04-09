# Használjuk a könnyűsúlyú Node.js 18-as verziót
FROM node:18-alpine

# Munkakönyvtár létrehozása a konténeren belül
WORKDIR /app

# Csomagkezelő fájlok másolása és telepítés
COPY package*.json ./
RUN npm install

# Az összes backend kód átmásolása
COPY . .

# A port nyitása (Amin a szervered fut)
EXPOSE 5000

# Indítási parancs (Bizonyosodj meg róla, hogy a package.json-ben van "start": "node server.js"!)
CMD ["npm", "start"]