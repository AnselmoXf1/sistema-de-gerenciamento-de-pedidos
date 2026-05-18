# 🗄️ Tutorial Completo - PostgreSQL para Lanchonete Digital

## 📋 Índice
1. [Instalar PostgreSQL](#1-instalar-postgresql)
2. [Configurar PostgreSQL](#2-configurar-postgresql)
3. [Criar Base de Dados](#3-criar-base-de-dados)
4. [Executar Script SQL](#4-executar-script-sql)
5. [Configurar Projeto](#5-configurar-projeto)
6. [Testar Conexão](#6-testar-conexão)
7. [Problemas Comuns](#7-problemas-comuns)

---

## 1. Instalar PostgreSQL

### Windows

#### Opção A: Instalador Oficial (Recomendado)

1. **Download:**
   - Acede: https://www.postgresql.org/download/windows/
   - Clica em "Download the installer"
   - Escolhe versão 14 ou superior
   - Download do ficheiro `.exe`

2. **Instalar:**
   ```
   1. Executar o instalador
   2. Next → Next
   3. Componentes: Marcar todos (PostgreSQL Server, pgAdmin 4, Command Line Tools)
   4. Directório: Deixar padrão (C:\Program Files\PostgreSQL\14)
   5. Senha do superuser (postgres): Escolher senha forte (ex: postgres123)
      ⚠️ GUARDAR ESTA SENHA!
   6. Porta: 5432 (padrão)
   7. Locale: Portuguese, Mozambique (ou Default)
   8. Next → Next → Install
   9. Aguardar instalação (~5 minutos)
   10. Finish
   ```

3. **Verificar Instalação:**
   ```bash
   # Abrir PowerShell ou CMD
   psql --version
   
   # Deve mostrar: psql (PostgreSQL) 14.x
   ```

#### Opção B: Chocolatey (Avançado)

```bash
# Instalar Chocolatey primeiro (se não tiver)
# https://chocolatey.org/install

# Instalar PostgreSQL
choco install postgresql14

# Verificar
psql --version
```

### Mac

```bash
# Opção 1: Homebrew (Recomendado)
brew install postgresql@14

# Iniciar serviço
brew services start postgresql@14

# Verificar
psql --version

# Opção 2: Postgres.app
# Download: https://postgresapp.com/
# Arrastar para Applications
```

### Linux (Ubuntu/Debian)

```bash
# Actualizar repositórios
sudo apt update

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib

# Verificar status
sudo systemctl status postgresql

# Verificar versão
psql --version
```

---

## 2. Configurar PostgreSQL

### Windows

1. **Abrir pgAdmin 4:**
   - Menu Iniciar → PostgreSQL 14 → pgAdmin 4
   - Aguardar abrir no browser
   - Senha: a que definiste na instalação

2. **Ou usar Command Line:**
   ```bash
   # Abrir PowerShell como Administrador
   
   # Conectar ao PostgreSQL
   psql -U postgres
   
   # Vai pedir senha (a que definiste)
   ```

### Mac/Linux

```bash
# Conectar ao PostgreSQL
sudo -u postgres psql

# Ou (se configuraste user)
psql -U postgres
```

---

## 3. Criar Base de Dados

### Método 1: Via psql (Linha de Comando)

```bash
# 1. Conectar ao PostgreSQL
psql -U postgres

# 2. Criar base de dados
CREATE DATABASE lanchonete_db;

# 3. Verificar
\l

# Deve aparecer lanchonete_db na lista

# 4. Conectar à base de dados
\c lanchonete_db

# 5. Sair
\q
```

### Método 2: Via pgAdmin 4

```
1. Abrir pgAdmin 4
2. Expandir Servers → PostgreSQL 14
3. Clicar direito em "Databases"
4. Create → Database
5. Nome: lanchonete_db
6. Owner: postgres
7. Save
```

---

## 4. Executar Script SQL

### Método 1: Via psql (Recomendado)

```bash
# 1. Navegar para a pasta do projeto
cd C:\Users\SeuUsuario\Desktop\saas

# 2. Executar script
psql -U postgres -d lanchonete_db -f database/schema.sql

# Vai pedir senha do postgres

# 3. Verificar se funcionou
psql -U postgres -d lanchonete_db

# Dentro do psql:
\dt

# Deve mostrar as 6 tabelas:
# - mesas
# - produtos
# - usuarios
# - pedidos
# - itens_pedido
# - log_sms
```

### Método 2: Via pgAdmin 4

```
1. Abrir pgAdmin 4
2. Conectar ao servidor PostgreSQL 14
3. Expandir Databases → lanchonete_db
4. Clicar direito em lanchonete_db
5. Query Tool
6. Abrir ficheiro: database/schema.sql
7. Clicar em ▶️ Execute/Refresh (F5)
8. Aguardar execução
9. Verificar mensagem de sucesso
```

### Método 3: Copiar e Colar

```bash
# 1. Abrir o ficheiro database/schema.sql
# 2. Copiar TODO o conteúdo (Ctrl+A, Ctrl+C)
# 3. Conectar ao psql
psql -U postgres -d lanchonete_db

# 4. Colar o conteúdo (Ctrl+V)
# 5. Enter para executar
```

---

## 5. Configurar Projeto

### 1. Editar .env

```bash
# Abrir ficheiro .env na raiz do projeto
# Windows: notepad .env
# Mac/Linux: nano .env
```

### 2. Configurar DATABASE_URL

```env
# Formato:
# DATABASE_URL="postgresql://USUARIO:SENHA@HOST:PORTA/NOME_BD?schema=public"

# Exemplo (ajustar com teus dados):
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/lanchonete_db?schema=public"

# Onde:
# - postgres = usuário (padrão)
# - postgres123 = senha que definiste
# - localhost = servidor local
# - 5432 = porta padrão
# - lanchonete_db = nome da base de dados
```

### 3. Exemplo Completo do .env

```env
# Servidor
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000

# Base de Dados PostgreSQL
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/lanchonete_db?schema=public"

# JWT
JWT_SECRET=minha_chave_secreta_muito_segura_123456789
JWT_EXPIRES_IN=8h

# Africa's Talking (deixar vazio por agora)
AT_API_KEY=
AT_USERNAME=
AT_SENDER_ID=LanchFatima
```

---

## 6. Testar Conexão

### Teste 1: Via psql

```bash
# Conectar à base de dados
psql -U postgres -d lanchonete_db

# Verificar tabelas
\dt

# Ver mesas
SELECT * FROM mesas;

# Ver produtos
SELECT * FROM produtos;

# Ver usuário admin
SELECT nome, email, role FROM usuarios;

# Sair
\q
```

### Teste 2: Via Projeto

```bash
# 1. Instalar dependências (se ainda não fez)
npm install

# 2. Testar conexão Prisma
npx prisma db pull

# Deve mostrar: "Introspected 6 models"

# 3. Gerar Prisma Client
npx prisma generate

# 4. Abrir Prisma Studio (interface visual)
npx prisma studio

# Abre no browser: http://localhost:5555
# Deve mostrar as 6 tabelas com dados
```

### Teste 3: Rodar Servidor

```bash
# Rodar backend
npm run dev

# Deve mostrar:
# ✅ Conectado à base de dados PostgreSQL
# 🚀 Servidor rodando na porta 3000
```

---

## 7. Problemas Comuns

### ❌ Erro: "psql: command not found"

**Solução Windows:**
```bash
# Adicionar ao PATH
1. Painel de Controlo → Sistema → Configurações Avançadas
2. Variáveis de Ambiente
3. Path → Editar
4. Adicionar: C:\Program Files\PostgreSQL\14\bin
5. OK → OK → Reiniciar terminal
```

**Solução Mac:**
```bash
# Adicionar ao PATH
echo 'export PATH="/usr/local/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### ❌ Erro: "password authentication failed"

**Solução:**
```bash
# Resetar senha do postgres

# Windows (PowerShell como Admin):
psql -U postgres
# Se pedir senha e não funcionar:

# 1. Parar serviço PostgreSQL
net stop postgresql-x64-14

# 2. Editar pg_hba.conf
# Localização: C:\Program Files\PostgreSQL\14\data\pg_hba.conf
# Mudar linha:
# host    all    all    127.0.0.1/32    md5
# Para:
# host    all    all    127.0.0.1/32    trust

# 3. Iniciar serviço
net start postgresql-x64-14

# 4. Conectar sem senha
psql -U postgres

# 5. Mudar senha
ALTER USER postgres PASSWORD 'nova_senha_123';

# 6. Reverter pg_hba.conf (md5)
# 7. Reiniciar serviço
```

### ❌ Erro: "database does not exist"

**Solução:**
```bash
# Criar base de dados
psql -U postgres
CREATE DATABASE lanchonete_db;
\q
```

### ❌ Erro: "port 5432 already in use"

**Solução:**
```bash
# Windows: Verificar processo
netstat -ano | findstr :5432
taskkill /PID <numero_do_pid> /F

# Mac/Linux:
lsof -ti:5432 | xargs kill -9
```

### ❌ Erro: "Prisma Client not generated"

**Solução:**
```bash
npx prisma generate
```

### ❌ Erro: "Connection refused"

**Solução:**
```bash
# Verificar se PostgreSQL está rodando

# Windows:
services.msc
# Procurar: postgresql-x64-14
# Status deve ser: Running

# Mac:
brew services list

# Linux:
sudo systemctl status postgresql
```

---

## 8. Comandos Úteis

### psql Básico

```bash
# Conectar
psql -U postgres -d lanchonete_db

# Listar bases de dados
\l

# Conectar a outra BD
\c nome_bd

# Listar tabelas
\dt

# Descrever tabela
\d nome_tabela

# Ver dados
SELECT * FROM nome_tabela;

# Sair
\q
```

### Backup e Restore

```bash
# Backup
pg_dump -U postgres lanchonete_db > backup.sql

# Restore
psql -U postgres -d lanchonete_db < backup.sql
```

### Limpar Dados

```bash
# Conectar
psql -U postgres -d lanchonete_db

# Limpar tabela (manter estrutura)
TRUNCATE TABLE pedidos CASCADE;

# Apagar e recriar
DROP DATABASE lanchonete_db;
CREATE DATABASE lanchonete_db;
```

---

## 9. Próximos Passos

Depois de configurar PostgreSQL:

1. ✅ Verificar que todas as tabelas existem
2. ✅ Verificar dados iniciais (10 mesas, 15 produtos, 1 usuário)
3. ✅ Testar conexão com Prisma Studio
4. ✅ Rodar servidor backend
5. ✅ Testar API endpoints

---

## 📞 Suporte

### Documentação Oficial
- PostgreSQL: https://www.postgresql.org/docs/
- Prisma: https://www.prisma.io/docs/

### Verificar Instalação
```bash
# Versão PostgreSQL
psql --version

# Status do serviço
# Windows: services.msc
# Mac: brew services list
# Linux: sudo systemctl status postgresql

# Testar conexão
psql -U postgres -c "SELECT version();"
```

---

**✅ Pronto! PostgreSQL configurado e pronto para usar!** 🎉

**Tempo estimado:** 15-30 minutos
