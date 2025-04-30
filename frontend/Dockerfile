# Usar imagem oficial do Node 20
FROM node:20

# Criar e usar diretório de trabalho
WORKDIR /app

# Copiar apenas arquivos de dependência primeiro
COPY package*.json ./

# Limpar cache e instalar dependências com npm ci (mais seguro)
RUN npm ci

# Copiar o restante do projeto
COPY . .

# Expor a porta usada pelo app (ajuste se necessário)
EXPOSE 3000

# Comando de inicialização
CMD ["npm", "run", "dev"]
