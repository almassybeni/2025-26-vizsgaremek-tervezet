FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# A Vite alapértelmezett portja
EXPOSE 5173

# Dockerben a --host paraméter elengedhetetlen a láthatósághoz!
CMD ["npm", "run", "dev", "--", "--host"]