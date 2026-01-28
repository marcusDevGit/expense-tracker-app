# 🐳 Docker PostgreSQL Setup

Este guia mostra como usar PostgreSQL com Docker no projeto.

## 📋 Pré-requisitos

- Docker instalado
- Imagem `postgres:alpine` (já baixada)

## 🚀 Como Usar

### 1. Iniciar o PostgreSQL

```bash
docker-compose up -d
```

**Flags:**

- `-d`: Roda em background (detached mode)

### 2. Verificar Status

```bash
# Ver logs
docker-compose logs -f postgres

# Verificar se está rodando
docker-compose ps
```

### 3. Configurar Variáveis de Ambiente

Copie as configurações do Docker:

```bash
cat .env.docker >> .env
```

Ou edite manualmente o `.env`:

```env
DATABASE_URL="postgresql://expense_user:expense_password@localhost:5432/expense_tracker?schema=public"
```

### 4. Executar Migrations

```bash
npm run migrate
```

### 5. Parar o PostgreSQL

```bash
# Parar os containers
docker-compose down

# Parar E remover os dados (⚠️ cuidado!)
docker-compose down -v
```

## 🔧 Comandos Úteis

### Acessar o PostgreSQL via CLI

```bash
docker-compose exec postgres psql -U expense_user -d expense_tracker
```

### Ver os Bancos de Dados

```bash
docker-compose exec postgres psql -U expense_user -c '\l'
```

### Backup do Banco

```bash
docker-compose exec postgres pg_dump -U expense_user expense_tracker > backup.sql
```

### Restaurar Backup

```bash
cat backup.sql | docker-compose exec -T postgres psql -U expense_user expense_tracker
```

## 📊 Credenciais Padrão

| Campo    | Valor              |
| -------- | ------------------ |
| Host     | `localhost`        |
| Porta    | `5432`             |
| Usuário  | `expense_user`     |
| Senha    | `expense_password` |
| Database | `expense_tracker`  |

## 🔐 Segurança

⚠️ **Para produção:**

1. Mude as credenciais no `docker-compose.yml`
2. Use variáveis de ambiente ou Docker secrets
3. Não commite senhas no repositório

## 🐛 Troubleshooting

### Porta 5432 já está em uso

```bash
# Ver o que está usando a porta
sudo lsof -i :5432

# Mudar a porta no docker-compose.yml
ports:
  - "5433:5432"  # Use 5433 no host

# Atualizar DATABASE_URL
DATABASE_URL="postgresql://expense_user:expense_password@localhost:5433/expense_tracker?schema=public"
```

### Container não inicia

```bash
# Ver logs de erro
docker-compose logs postgres

# Remover tudo e começar de novo
docker-compose down -v
docker-compose up -d
```
