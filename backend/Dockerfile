FROM php:8.2-cli

# Instala dependências do sistema
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libxml2-dev \
    git \
    unzip \
    default-mysql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

# Instala Composer globalmente
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin \
    --filename=composer

# Configura diretório de trabalho
WORKDIR /var/www

# Copia TODO o conteúdo do projeto (apenas UMA vez)
COPY . .

# Instala dependências do Composer
RUN composer install --no-interaction --optimize-autoloader --no-dev

# Configura permissões (ajustado para Laravel)
RUN chown -R www-data:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Copia e prepara o script de inicialização
COPY startup.sh /usr/local/bin/startup
RUN chmod +x /usr/local/bin/startup

# Expõe a porta e define o comando de inicialização
EXPOSE 8000
CMD ["startup"]