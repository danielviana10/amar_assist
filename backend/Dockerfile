# Usando a imagem oficial do PHP 8.2
FROM php:8.2-fpm

# Instalando dependências do PHP
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev libxml2-dev git unzip

# Instalando o Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instalando o cliente MySQL com o pacote correto
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev libxml2-dev git unzip default-mysql-client

# Copiando o conteúdo do projeto para dentro do container
WORKDIR /var/www
COPY . .

# Instalando as dependências do Laravel
RUN composer install --no-interaction --optimize-autoloader

# Configurando permissões
RUN chown -R www-data:www-data /var/www
RUN chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Expondo a porta 9000 para o PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
