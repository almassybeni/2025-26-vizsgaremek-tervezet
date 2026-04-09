FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
# Itt meg kell adni a script nevét, pl: dev vagy start
CMD ["npm", "run", "dev"]