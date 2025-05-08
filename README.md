<h1>Amarassist</h1>

<p>Projeto full-stack com <strong>Laravel</strong> (backend), <strong>Vue.js</strong> (frontend) e <strong>MySQL</strong>, orquestrado via <strong>Docker</strong>.</p>

<h2>🔧 Requisitos</h2>
<ul>
<li><a href="https://www.docker.com/get-started" target="_blank">Docker</a></li>
<li><a href="https://docs.docker.com/compose/install/" target="_blank">Docker Compose</a></li>
</ul>

<h2>📄 Documentação Swagger</h2>
<p>A documentação da API está disponível via Swagger em <code>http://localhost:8080/doc</code>. Ela segue o padrão OpenAPI 3.0 e pode ser acessada após subir o container <code>swagger</code>.</p>
<p>Arquivo de definição: <code>/docs/openapi.yaml</code></p>

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
<p>Renomeie o .env.example para .env e gere a chave da aplicação:</p>
<pre><code>
cd backend
cp .env.example .env
php artisan key:generate
</code></pre>

<h3>3. Configuração do Frontend</h3>
<p>O .env não possuí dados sensiveis, então já está no projeto assim:</p>
<pre><code>VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=AmarAssist</code></pre>

<h3>4. Construção dos Containers</h3>
<p>No diretório raiz do projeto, construa e inicie os containers Docker com o comando:</p>
<pre><code>docker-compose up -d --build</code></pre>

<p>Serviços iniciados:</p>
<ul>
<li><strong>Backend</strong>: <code>http://localhost:8000</code></li>
<li><strong>Frontend</strong>: <code>http://localhost:5173</code></li>
<li><strong>MySQL</strong>: <code>localhost:3307</code></li>
</ul>

<h2>🧪 Acesso e Comandos</h2>

<h3>1. Rodar migrações do Laravel</h3>
<pre><code>docker exec -it amarassist-backend bash
php artisan migrate</code></pre>

<h3>2. Acessar o banco MySQL</h3>
<pre><code>docker exec -it amarassist-db mysql -u root -p</code></pre>
<p>Senha: <code>rootpassword</code></p>

<h3>3. Comandos Docker úteis</h3>
<ul>
<li><code>docker-compose up -d --build</code>: Subir os containers</li>
<li><code>docker-compose down</code>: Parar os containers</li>
<li><code>docker-compose logs -f</code>: Ver logs</li>
<li><code>docker-compose restart</code>: Reiniciar todos os containers</li>
</ul>

<h2>📌 Considerações</h2>
<ul>
<li>Frontend utiliza Vite com Vue.js.</li>
<li>Backend PHP na versão 8.2 + Laravel na versão 9.52</li>
<li>Banco de dados MySQL na versão 8.0</li>
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
