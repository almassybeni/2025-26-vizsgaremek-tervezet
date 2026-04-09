FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# A backend portja általában 3000 vagy 5000
EXPOSE 5000

CMD ["npm", "run", "dev", "--", "--host"]