# 💰 Expense Tracker APP (Construção em andamento)

> 📍 **Você está na documentação do Backend API**  
> 🔙 [Voltar para documentação principal do projeto](../README.md)

API RESTful para gerenciamento de despesas pessoais, construída com Node.js, TypeScript, Express e Prisma ORM.

**Este é o backend** de uma aplicação fullstack. O frontend será desenvolvido separadamente.

## 📋 Índice

- [Sobre](#sobre)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Endpoints da API](#endpoints-da-api)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Testes](#testes)

---

## 🎯 Sobre

O **Expense Tracker API** é uma aplicação backend para controle financeiro pessoal, permitindo:

- ✅ Autenticação e gerenciamento de usuários
- ✅ Criação e gerenciamento de carteiras (wallets)
- ✅ Registro e categorização de despesas
- ✅ Categorias personalizadas por usuário
- ✅ Suporte a despesas recorrentes

---

## 🚀 Tecnologias

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado do JavaScript
- **[Express](https://expressjs.com/)** - Framework web minimalista
- **[Prisma](https://www.prisma.io/)** v7.3.0 - ORM moderno para Node.js
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[JWT](https://jwt.io/)** - Autenticação via JSON Web Tokens
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Criptografia de senhas
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript executor para desenvolvimento

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 24.x
- **npm** >= 10.x
- **PostgreSQL** >= 14.x
- **Docker** (opcional, para rodar PostgreSQL em container)

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd expens-tracker-api
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

#### Opção A: PostgreSQL Local

Certifique-se de que o PostgreSQL está rodando e crie um banco de dados:

```sql
CREATE DATABASE expense_tracker;
CREATE USER expense_user WITH PASSWORD 'expense_password';
GRANT ALL PRIVILEGES ON DATABASE expense_tracker TO expense_user;
```

#### Opção B: Docker

```bash
docker-compose up -d
```

---

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
# Servidor
PORT=3333

# JWT
JWT_SECRET=your-super-secret-jwt-key-change

# Database
DATABASE_URL="postgresql://expense_user:expense_password@localhost:5432/expense12_tracker?schema=public"
```

⚠️ **IMPORTANTE**: Altere o `JWT_SECRET` em produção!

### 2. Migrations do Banco de Dados

Execute as migrations para criar as tabelas:

```bash
npx prisma migrate dev
```

### 3. Gere o Prisma Client

```bash
npx prisma generate
```

---

## 🏃 Como Executar

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em: `http://localhost:3333`

### Modo Produção

```bash
# Build
npm run build

# Start
npm start
```

---

## 📁 Estrutura do Projeto

```
expens-tracker-api/
├── prisma/
│   ├── schema.prisma           # Schema do banco de dados
│   └── migrations/             # Histórico de migrations
│
├── src/
│   ├── app/
│   │   ├── app.ts             # Configuração do Express
│   │   └── server.ts          # Inicialização do servidor
│   │
│   ├── config/
│   │   ├── database.ts        # Configuração do Prisma (com adapter)
│   │   ├── jwt.ts             # Configuração JWT
│   │   └── env.ts             # Validação de variáveis de ambiente
│   │
│   ├── modules/
│   │   ├── auth/              # Módulo de autenticação
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.middleware.ts
│   │   │
│   │   ├── users/             # Módulo de usuários
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.validation.ts
│   │   │
│   │   ├── wallets/           # Módulo de carteiras (a implementar)
│   │   ├── expenses/          # Módulo de despesas (a implementar)
│   │   └── categories/        # Módulo de categorias (a implementar)
│   │
│   ├── shared/
│   │   ├── errors/            # Classes de erro customizadas
│   │   ├── middlewares/       # Middlewares globais
│   │   ├── utils/             # Funções utilitárias
│   │   └── constants/         # Constantes da aplicação
│   │
│   ├── types/
│   │   └── express.d.ts       # Extensões de tipos do Express
│   │
│   └── routes/
│       └── index.ts           # Agregador de rotas
│
├── .env                       # Variáveis de ambiente (não commitado)
├── .env.example               # Exemplo de variáveis de ambiente
├── package.json
├── tsconfig.json
├── prisma.config.ts           # Configuração do Prisma
└── README.md
```

---

## 🔌 Endpoints da API

### 🏥 Health Check

```http
GET /api/health
```

**Resposta:**

```json
{
  "status": "ok"
}
```

---

### 👤 Autenticação

#### Registrar Usuário

```http
POST /api/users/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123456"
}
```

**Resposta (201):**

```json
{
  "id": "clxxxx...",
  "name": "João Silva",
  "email": "joao@example.com"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123456"
}
```

**Resposta (200):**

```json
{
  "user": {
    "id": "clxxxx...",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout

```http
POST /api/auth/logout
```

**Resposta (204):** No Content

---

### 🔒 Rotas Protegidas

Para rotas protegidas, adicione o header de autenticação:

```http
Authorization: Bearer {seu-token-jwt}
```

#### Obter Perfil

```http
GET /api/users/profile
Authorization: Bearer {token}
```

#### Atualizar Perfil

```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "João Silva Atualizado",
  "email": "novo@example.com"
}
```

#### Deletar Conta

```http
DELETE /api/users/profile
Authorization: Bearer {token}
```

---

## 📜 Scripts Disponíveis

```json
{
  "dev": "tsx watch src/app/server.ts", // Modo desenvolvimento com hot-reload
  "build": "tsc --build", // Compilar TypeScript para produção
  "start": "node dist/app/server.js", // Rodar em produção
  "migrate": "prisma migrate dev", // Criar nova migration
  "generate": "prisma generate", // Gerar Prisma Client
  "studio": "prisma studio", // Abrir Prisma Studio (GUI)
  "type-check": "tsc --noEmit", // Verificar tipos sem compilar
  "db": "docker start expense-tracker-postgres" // Iniciar container do DB
}
```

---

## 🧪 Testes

Use o arquivo `testes.http` na raiz do projeto com extensões como:

- **[REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)** (VS Code)

Exemplo:

```http
### Registrar Usuário
POST http://localhost:3333/api/users/register
content-type: application/json

{
  "name": "Teste User",
  "email": "teste@example.com",
  "password": "senha123"
}
```

---

## 📝 Observações Importantes

### Segurança

- 🔒 Senhas são hasheadas com **bcrypt** (salt rounds: 10)
- 🔐 Autenticação via **JWT** com expiração de 1 dia
- ✅ Validação de dados com **Zod**
- 🛡️ Emails únicos no banco de dados

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

**Marcus Phellypp**

---

## 🐛 Encontrou um Bug?

Abra uma [issue](../../issues) descrevendo o problema.
