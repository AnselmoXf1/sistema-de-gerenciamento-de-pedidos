# ⚡ INÍCIO RÁPIDO - 10 Minutos

## 🎯 Objectivo
Ter o sistema rodando em 10 minutos!

---

## 📋 Passo a Passo

### 1️⃣ Instalar PostgreSQL (5 min)

**Windows:**
```
1. Download: https://www.postgresql.org/download/windows/
2. Executar instalador
3. Senha do postgres: postgres123 (guardar!)
4. Porta: 5432
5. Finish
```

**Verificar:**
```bash
psql --version
# Deve mostrar: psql (PostgreSQL) 14.x
```

---

### 2️⃣ Criar Base de Dados (2 min)

```bash
# Abrir terminal/PowerShell

# Conectar ao PostgreSQL
psql -U postgres
# Senha: postgres123

# Criar base de dados
CREATE DATABASE lanchonete_db;

# Verificar
\l

# Sair
\q
```

---

### 3️⃣ Executar Script SQL (1 min)

```bash
# Na pasta do projeto
cd C:\Users\SeuUsuario\Desktop\saas

# Executar script
psql -U postgres -d lanchonete_db -f database/schema.sql

# Senha: postgres123

# Deve mostrar: "Base de dados criada com sucesso!"
```

---

### 4️⃣ Configurar .env (1 min)

```bash
# Copiar exemplo
cp .env.example .env

# Editar .env (notepad .env)
# Mudar esta linha:
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/lanchonete_db?schema=public"

# Salvar e fechar
```

---

### 5️⃣ Instalar e Rodar (1 min)

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar backend
npm run dev

# Deve mostrar:
# ✅ Conectado à base de dados PostgreSQL
# 🚀 Servidor rodando na porta 3000
```

---

## ✅ Verificar

### Teste 1: API
```
Abrir browser: http://localhost:3000
Deve mostrar: "🍔 Lanchonete Digital API"
```

### Teste 2: Cardápio
```
Abrir: http://localhost:3000/api/cardapio
Deve mostrar: JSON com 15 produtos
```

### Teste 3: Prisma Studio
```bash
# Novo terminal
npx prisma studio

# Abre: http://localhost:5555
# Deve mostrar 6 tabelas com dados
```

---

## 🚀 Rodar Frontend

### Terminal 2 - Cliente
```bash
cd frontend/cliente
npm install
npm run dev

# Abre: http://localhost:5173
```

### Terminal 3 - Painel
```bash
cd frontend/painel
npm install
npm run dev

# Abre: http://localhost:5174
# Login: admin@lanchonete.mz / admin123
```

---

## 🎉 Pronto!

**URLs:**
- API: http://localhost:3000
- Cliente: http://localhost:5173
- Painel: http://localhost:5174
- Prisma Studio: http://localhost:5555

**Login Painel:**
- Email: `admin@lanchonete.mz`
- Senha: `admin123`

---

## ❌ Problemas?

### Erro: "psql: command not found"
```bash
# Adicionar ao PATH:
# C:\Program Files\PostgreSQL\14\bin
```

### Erro: "password authentication failed"
```bash
# Verificar senha no .env
# Deve ser a mesma da instalação
```

### Erro: "database does not exist"
```bash
# Criar novamente:
psql -U postgres
CREATE DATABASE lanchonete_db;
\q
```

### Erro: "port already in use"
```bash
# Parar processo:
# Windows: netstat -ano | findstr :3000
# taskkill /PID <numero> /F
```

---

## 📚 Documentação Completa

- **PostgreSQL:** `TUTORIAL_POSTGRESQL.md`
- **Instalação:** `GUIA_INSTALACAO.md`
- **API:** `API_DOCUMENTATION.md`
- **Projeto:** `PROJETO_COMPLETO.md`

---

**✅ Sistema rodando em 10 minutos!** 🎊
