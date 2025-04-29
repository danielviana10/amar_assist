# Usar Node
FROM node:20

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar o restante
COPY . .

# Expor porta
EXPOSE 3000

CMD ["npm", "run", "dev"]
