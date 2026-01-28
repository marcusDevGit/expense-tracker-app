# 💰 Expense Tracker - Full Stack Application

> 🚧 **Status:** Em desenvolvimento

Aplicação fullstack para gerenciamento de despesas pessoais, permitindo controle financeiro completo através de carteiras, categorias e despesas recorrentes.

---

## 📋 Estrutura do Projeto

```
expense-tracker-app/
├── expens-tracker-api/     # 🟢 Backend API (Implementado)
│   ├── src/
│   ├── prisma/
│   └── README.md          # Documentação da API
│
└── expense-tracker-web/    # 🔴 Frontend Web (A implementar)
    └── README.md          # Documentação do frontend
```

---

## 🎯 Componentes do Projeto

### ✅ Backend API - `expens-tracker-api/`

**Status:** Implementado e funcional

Tecnologias:

- Node.js + TypeScript
- Express.js
- Prisma ORM v7.3.0
- PostgreSQL
- JWT Authentication

[📖 Ver documentação completa do backend →](./expens-tracker-api/README.md)

**Endpoints disponíveis:**

- ✅ Autenticação (login/logout/registro)
- ✅ Gerenciamento de usuários
- 🔄 Carteiras (estrutura criada)
- 🔄 Despesas (estrutura criada)
- 🔄 Categorias (estrutura criada)

---

### 🔜 Frontend Web - `expense-tracker-web/`

**Status:** A ser implementado

Tecnologias planejadas:

- React.js / Next.js
- TypeScript
- TailwindCSS / Styled Components
- React Query / SWR
- React Hook Form + Zod

**Funcionalidades planejadas:**

- 🔲 Sistema de autenticação com JWT
- 🔲 Dashboard com visão geral das finanças
- 🔲 Gerenciamento de carteiras
- 🔲 Registro e categorização de despesas
- 🔲 Gráficos e relatórios
- 🔲 Tema claro/escuro

---

## 🚀 Como Começar

### Pré-requisitos

- Node.js >= 24.x
- npm >= 10.x
- PostgreSQL >= 14.x
- Git

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd expense-tracker-app
```

### 2. Configure o Backend

```bash
cd expens-tracker-api
npm install
cp .env.example .env

# Configure as variáveis no .env
# Execute as migrations
npx prisma migrate dev

# Inicie o servidor
npm run dev
```

O backend estará rodando em: `http://localhost:3333`

[📖 Documentação completa do backend](./expens-tracker-api/README.md)

### 3. Configure o Frontend

_🚧 A ser implementado_

---

## 📊 Progresso do Projeto

### Backend (expens-tracker-api)

- [x] Estrutura inicial do projeto
- [x] Configuração do TypeScript e Express
- [x] Setup do Prisma ORM v7 com PostgreSQL
- [x] Módulo de autenticação (JWT)
  - [x] Registro de usuários
  - [x] Login
  - [x] Logout
  - [x] Middleware de autenticação
- [x] Módulo de usuários
  - [x] CRUD básico
  - [x] Validações com Zod
- [x] Schema do banco de dados
  - [x] Model User
  - [x] Model Wallet
  - [x] Model Category
  - [x] Model Expense
- [ ] Implementação completa de Wallets
- [ ] Implementação completa de Expenses
- [ ] Implementação completa de Categories
- [ ] Testes unitários e de integração
- [ ] Documentação Swagger/OpenAPI

### Frontend (expense-tracker-web)

- [ ] Setup inicial do projeto
- [ ] Configuração de rotas
- [ ] Sistema de autenticação
- [ ] Dashboard
- [ ] Gerenciamento de carteiras
- [ ] Gerenciamento de despesas
- [ ] Gerenciamento de categorias
- [ ] Gráficos e relatórios
- [ ] Responsividade mobile

---

## 🛠️ Stack Tecnológico

### Backend

- **Runtime:** Node.js 24.x
- **Linguagem:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma 7.3.0
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT + Bcrypt
- **Validação:** Zod

### Frontend (Planejado)

- **Framework:** React.js / Next.js
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS
- **Gerenciamento de Estado:** Context API / Zustand
- **Requisições HTTP:** Axios / Fetch + React Query
- **Validação de Formulários:** React Hook Form + Zod

---

## 📝 Convenções do Projeto

### Commits

Seguimos o padrão de commits semânticos:

```
feat: adiciona nova funcionalidade
fix: corrige um bug
docs: atualização de documentação
refactor: refatoração de código
test: adição ou modificação de testes
chore: tarefas de manutenção
```

### Branches

- `main` - Código em produção
- `develop` - Branch de desenvolvimento
- `feature/*` - Novas funcionalidades
- `fix/*` - Correções de bugs
- `docs/*` - Atualizações de documentação

---

## 👨‍💻 Autor

**Marcus Phellypp**

---

## 📄 Licença

Este projeto está sob a licença MIT.
