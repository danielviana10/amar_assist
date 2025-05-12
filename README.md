<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
</head>
<body>

<h1>Amar Assist</h1>
<p>Projeto full-stack com <strong>PHP + Laravel</strong>, <strong>Vue.js</strong> e <strong>MySQL</strong>, orquestrado via <strong>Docker</strong>.</p>

<h2>Requisitos</h2>
<ul>
  <li><a href="https://www.docker.com/get-started" target="_blank">Docker</a></li>
  <li><a href="https://docs.docker.com/compose/install/" target="_blank">Docker Compose</a></li>
</ul>

<h2>Documentação Notion</h2>
<p>A documentação da API está disponível via Notion.
<ul>
  <li><a href="https://www.notion.so/Amar-Assist-API-1-0-1ee8ed6afd0180a8ac25fe8352938c8f?pvs=4" target="_blank">Amar Assist API</a></li>
</ul>

<h2>Workspace Amar Assist POSTMAN</h2>
<p>O workspace da API está disponível no Postman, é necessário adicionar o TOKEN do usuário como variável.</p>
<ul>
  <li><a href="https://www.postman.com/research-geologist-66458252/workspace/amar-workspace/collection/37103779-9c7cc1e0-dc86-4092-8ede-5d5c8e67ed61?action=share&creator=37103779&active-environment=37103779-632b9de4-b8f5-4bd7-8469-3558c8e6d2df" target="_blank">Amar Assist POSTMAN</a></li>
</ul>

<h2>📁 Estrutura do Projeto</h2>
<pre>
/amarassist
├── /backend
├── /frontend
├── docker-compose.yml
</pre>

<h2>🚀 Passos para Instalação</h2>

<h3>1. Clone o repositório</h3>
<pre><code>git clone &lt;url-do-repositorio&gt;
cd amarassist</code></pre>

<h3>2. Configuração do Backend</h3>
<p>Renomeie o <code>.env.example</code> para <code>.env</code>.</p>
<pre><code>cd backend
cp .env.example .env</code></pre>

<h3>3. Configuração do Frontend</h3>
<p>O <code>.env</code> já está incluso no projeto com as seguintes variáveis:</p>
<pre><code>VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=AmarAssist</code></pre>

<h3>4. Construção dos Containers</h3>
<p>Na raiz do projeto, inicie os containers Docker:</p>
<pre><code>docker-compose up -d --build</code></pre>
<p>O Seeder criará o usuário base e um produto referência.</p>

<p>Serviços iniciados:</p>
<ul>
  <li><strong>Backend</strong>: <code>http://localhost:8000</code></li>
  <li><strong>Frontend</strong>: <code>http://localhost:5173</code></li>
  <li><strong>MySQL</strong>: <code>localhost:3307</code></li>
</ul>

<h2>Acesso e Comandos</h2>

<h3>1. Acessar o banco MySQL</h3>
<pre><code>docker exec -it amarassist-db mysql -u root -p</code></pre>
<p>Senha: <code>rootpassword</code></p>

<h3>2. Comandos Docker úteis</h3>
<ul>
  <li><code>docker-compose up -d --build</code>: Subir os containers</li>
  <li><code>docker-compose down</code>: Parar os containers</li>
  <li><code>docker-compose logs -f</code>: Ver logs</li>
  <li><code>docker-compose restart</code>: Reiniciar todos os containers</li>
</ul>

<h2>📌 Considerações</h2>
<ul>
  <li>Frontend utiliza Vite com Vue.js.</li>
  <li>Backend PHP 8.2 + Laravel 9.52</li>
  <li>Banco de dados MySQL 8.0</li>
</ul>

<h2>🤝 Contribuição</h2>
<ol>
  <li>Fork este repositório.</li>
  <li>Crie uma branch com sua feature.</li>
  <li>Commit e envie para seu fork.</li>
  <li>Abra um Pull Request.</li>
</ol>

</body>
</html>
