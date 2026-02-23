# 💰 Expense Tracker - Full Stack Application

[![Status](https://img.shields.io/badge/Status-Production--Ready-brightgreen)](https://expense-tracker-app-rho-lake.vercel.app)

Sistema completo de controle financeiro pessoal, desenvolvido com uma arquitetura moderna, escalável e segura.

---

## 🏗️ O Ecossistema

O projeto é dividido em dois grandes pilares integrados:

### 1. 🧠 [Backend API](./expens-tracker-api)

API RESTful construída com **Node.js**, **Express v5** e **Prisma ORM**.

- **Hospedagem:** Railway
- **Banco de Dados:** PostgreSQL (Neon.tech)
- **Funcionalidades:** Auth JWT, Refresh Tokens, Recuperação de Senha, CRUDs validados com Zod.
- **Docs:** Swagger UI integrado.

### 2. 🎨 [Frontend Web](./expens-tracker-web)

Single Page Application (SPA) reativa construída com **React 19** e **Vite**.

- **Hospedagem:** Vercel
- **Estado:** Zustand + TanStack Query para sincronização de dados.
- **UI/UX:** TailwindCSS + Shadcn/UI com suporte a Dark Mode e Gráficos Recharts.

---

## 🚀 Links do Projeto em Produção

- **Aplicação Web:** [https://expense-tracker-app-rho-lake.vercel.app](https://expense-tracker-app-rho-lake.vercel.app)
- **Documentação da API:** [https://expense-tracker-app-production-dc4e.up.railway.app/api-docs](https://expense-tracker-app-production-dc4e.up.railway.app/api-docs)

---

## 🛠️ Stack Tecnológico Global

| Camada        | Tecnologias                                            |
| :------------ | :----------------------------------------------------- |
| **Linguagem** | TypeScript (Fullstack)                                 |
| **Frontend**  | React, TailwindCSS, Lucide Icons, Shadcn/UI            |
| **Backend**   | Express, Prisma ORM, Bcrypt, JsonWebToken              |
| **Infra**     | Neon (DB), Railway (API), Vercel (Web), GitHub Actions |

---

## 📊 Progresso Final

- [x] Arquitetura de Pastas Padronizada ✅
- [x] Migração para PostgreSQL Remoto (Neon) ✅
- [x] Implementação de Autenticação Robusta ✅
- [x] Gerenciamento de Carteiras e Despesas ✅
- [x] Tratamento de Erros Global (AppError) ✅
- [x] Documentação Swagger ✅
- [x] Deploy Contínuo (CI/CD) ✅

---

## 👨‍💻 Autor e Mantenedor

O projeto foi desenvolvido por **Marcus Phellypp**, focado em aplicar as melhores práticas de desenvolvimento web moderno e engenharia de software.

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE).
