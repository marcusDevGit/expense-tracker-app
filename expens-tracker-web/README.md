# 💰 Expense Tracker Web (Frontend)

Aplicação React moderna para gerenciamento de finanças pessoais, com foco em experiência de usuário (UX) e performance.

🔗 **Acesse o App Online:** [https://expense-tracker-app-rho-lake.vercel.app](https://expense-tracker-app-rho-lake.vercel.app)

---

## 🚀 Tecnologias

- **Framework:** [React 19](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack Query (React Query) v5](https://tanstack.com/query/latest)
- **Requisições:** [Axios](https://axios-http.com/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Navegação:** [React Router 7](https://reactrouter.com/)

---

## 🎨 Funcionalidades Principais

- **Dashboard Inteligente:** Visão geral de receitas, despesas e saldos com gráficos dinâmicos.
- **Gestão de Carteiras:** Múltiplas carteiras para organizar seu dinheiro.
- **Controle de Gastos:** Cadastro rápido de despesas com categorização.
- **Configurações Personalizadas:** Dia de início do mês, moeda, formato de data e modo discreto (ocultar saldos).
- **Design Adaptativo:** Tema Dark/Light e responsividade completa.
- **Segurança:** Autenticação robusta com JWT e Cookies seguros.

---

## ⚙️ Configuração Local

### 1. Requisitos

- Node.js 22+
- npm 10+

### 2. Instalação

```bash
cd expens-tracker-web
npm install
```

### 3. Variáveis de Ambiente

Crie um arquivo `.env` na raiz da pasta `expens-tracker-web`:

```env
VITE_API_URL=http://localhost:3333/api/v1/
```

### 4. Executar

```bash
npm run dev
```

---

## 📁 Estrutura de Pastas

- `src/components`: Componentes reutilizáveis (UI e Layout).
- `src/pages`: Telas principais da aplicação.
- `src/services`: Integração com a API via Axios.
- `src/stores`: Gerenciamento de estado global (Auth, Settings).
- `src/hooks`: Hooks customizados e integração com React Query.
- `src/shared`: Utilitários e tipos globais.

---

## 👨‍💻 Autor

**Marcus Phellypp**

---

## 📄 Licença

Este projeto está sob a licença MIT.
