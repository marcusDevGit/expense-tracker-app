# 💰 Expense Tracker API

Backend RESTful profissional para gerenciamento de despesas pessoais, focado em segurança, arquitetura limpa e alta disponibilidade.

🔗 **Documentação Swagger:** [https://expense-tracker-app-production-dc4e.up.railway.app/api-docs](https://expense-tracker-app-production-dc4e.up.railway.app/api-docs)

---

## 🚀 Tecnologias e Infraestrutura

- **Runtime:** [Node.js v22+](https://nodejs.org/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **ORM:** [Prisma v7](https://www.prisma.io/) (com drivers serverless)
- **Banco de Dados:** [PostgreSQL (Neon.tech)](https://neon.tech/)
- **Deploy:** [Railway](https://railway.app/)
- **Autenticação:** [JWT](https://jwt.io/) + [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Validação:** [Zod](https://zod.dev/)

---

## 🏛️ Arquitetura do Sistema

O projeto segue princípios de **Clean Architecture** adaptados para simplicidade:

- **Routes:** Definição de endpoints e injeção de dependências.
- **Controllers:** Orquestração de requisições, respostas e validação básica.
- **Services:** Onde a "mágica" acontece (Regras de negócio isoladas).
- **Config:** Centralização de drivers (Neon/Prisma), variáveis de ambiente e segurança.
- **Shared:** Middlewares globais (Tratamento de erros e Auth) e utilitários.

---

## ⚙️ Configuração para Desenvolvimento

### 1. Instalação

```bash
cd expens-tracker-api
npm install
```

### 2. Banco de Dados e Prisma

```bash
# Configure o DATABASE_URL no seu .env
npx prisma generate
npx prisma migrate dev
```

### 3. Scripts Principais

- `npm run dev`: Inicia o servidor em modo desenvolvimento (TSX).
- `npm run build`: Compila o TypeScript para a pasta `dist/`.
- `npm start`: Roda a aplicação compilada em produção.

---

## 🔐 Variáveis de Ambiente Necessárias

| Variável             | Descrição                                                          |
| :------------------- | :----------------------------------------------------------------- |
| `DATABASE_URL`       | Conexão com o PostgreSQL.                                          |
| `JWT_SECRET`         | Chave secreta para tokens de acesso.                               |
| `JWT_REFRESH_SECRET` | Chave secreta para tokens de renovação.                            |
| `NODE_ENV`           | Define o comportamento de Cookies e CORS (development/production). |
| `FRONTEND_URL`       | URL do frontend permitida pelo CORS.                               |

---

## 👨‍💻 Autor

**Marcus Phellypp**

---

## 📄 Licença

MIT
