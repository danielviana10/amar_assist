#!/bin/bash

# Configura variáveis de ambiente
export $(grep -v '^#' .env | xargs)

# Espera o MySQL ficar pronto
echo "⌛ Aguardando MySQL..."
while ! mysqladmin ping -h"$DB_HOST" -u"$DB_USERNAME" -p"$DB_PASSWORD" --silent; do
    sleep 1
done

# Cria o link simbólico do storage para refletir as imagens
echo "🔗 Criando link simbólico do storage..."
php artisan storage:link || echo "Link já existe"

# Executa migrações e seeds
echo "🔄 Rodando migrações..."
php artisan migrate --force

echo "🌱 Populando banco de dados..."
php artisan db:seed --force

# Inicia o servidor
echo "🚀 Iniciando servidor Laravel na porta 8000..."
php artisan serve --host=0.0.0.0 --port=8000