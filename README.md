# lawer-task

Gerenciado de Tarefas com registro e login de clientes

## Funcionalidades

- Registro, Exibiçao, Ediçao e exclusao de tarefas
- Registro e Login de clientes
- Painel de Clientes
- Dashboard com princiapais dados da solucao

## Tecnologias Utilizadas

- **Linguagens:** TypeScript, HTML
- **Frameworks:** React, Next.js14, Nest.js, PrismaOrm,
- **Banco de Dados:** PostgreSQL
- **Ferramentas:** Docker, Git, VS Code, Swagger, Jwt

## Como Instalar

Para executar este projeto localmente, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 20.19.04 ou superior)
- [npm](https://www.npmjs.com/) (versão 10.8.2 ou superior)

### Instalação

1.  **Clone o repositório:**

    git clone [https://github.com/diegoo237/lawer-task]
    cd lawer-task

2.  **Instale as dependências:**
    cd lawertask-api
    npm install
    cd lawertask-web
    npm install

3.  **Configuração de variáveis de ambiente (se aplicável):**
    Altere a variavel de ambiente DATABASE_URL no .env dentro de lawertask api com a string de conexao do seu banco PostgreSQL

## Como Usar

Para rodar os teste dentro de lawertask-api rode:
    npm run test:e2e src/app.e2e-spec.ts

Para iniciar a aplicação:

detro de lawertask-api
    npm run start

dentro de lawertask-web
    PORT=4000 npm run dev

Apos isso o Backend estara rodando na porta 3000 e o front na 4000
-É possivel testar e visualizar as rotas do backEnd na interface do swager que pode ser acessada em: http://localhost:3000/api
