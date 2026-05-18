# 🚀 Configurar Base de Dados Render

## ✅ Base de Dados Configurada!

Tua base de dados Render já está configurada no projeto:

```
Host: dpg-d81napl0lvsc73fme010-a.oregon-postgres.render.com
Database: txopela_tour
User: txopela_user
Password: QbElw4O9jqyL7V7qql8kKWwF0qZ0F75h
```

---

## 🎯 Próximos Passos

### 1️⃣ Criar Tabelas na Base de Dados (2 min)

```bash
# Opção A: Usar Prisma (RECOMENDADO)
npx prisma db push

# Vai criar todas as 6 tabelas automaticamente
# Aguardar: "Your database is now in sync with your schema"
```

**OU**

```bash
# Opção B: Executar script SQL direto
psql "postgresql://txopela_user:QbElw4O9jqyL7V7qql8kKWwF0qZ0F75h@dpg-d81napl0lvsc73fme010-a.oregon-postgres.render.com/txopela_tour" -f database/schema.sql
```

---

### 2️⃣ Popular com Dados Iniciais (1 min)

```bash
# Executar seed
npm run db:seed

# Vai criar:
# - 10 mesas com QR codes
# - 15 produtos (cardápio)
# - 1 usuário admin
```

---

### 3️⃣ Verificar Conexão (30 seg)

```bash
# Gerar Prisma Client
npx prisma generate

# Abrir Prisma Studio
npx prisma studio

# Abre no browser: http://localhost:5555
# Deve mostrar as 6 tabelas
```

---

### 4️⃣ Rodar Servidor (30 seg)

```bash
# Rodar backend
npm run dev

# Deve mostrar:
# ✅ Conectado à base de dados PostgreSQL
# 🚀 Servidor rodando na porta 3000
```

---

## 🧪 Testar API

### Teste 1: Health Check
```
http://localhost:3000
```

### Teste 2: Cardápio
```
http://localhost:3000/api/cardapio
```

### Teste 3: Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lanchonete.mz","senha":"admin123"}'
```

---

## 🔍 Conectar Direto ao Render (Opcional)

### Via psql
```bash
psql "postgresql://txopela_user:QbElw4O9jqyL7V7qql8kKWwF0qZ0F75h@dpg-d81napl0lvsc73fme010-a.oregon-postgres.render.com/txopela_tour"

# Dentro do psql:
\dt                    # Listar tabelas
SELECT * FROM mesas;   # Ver mesas
SELECT * FROM produtos; # Ver produtos
\q                     # Sair
```

### Via Prisma Studio
```bash
npx prisma studio

# Abre interface visual
# http://localhost:5555
```

---

## 📊 Estrutura da Base de Dados

Depois do `db:push` ou `schema.sql`, terás:

### Tabelas:
1. ✅ **mesas** - 10 mesas (1-10)
2. ✅ **produtos** - 15 produtos
3. ✅ **usuarios** - 1 admin
4. ✅ **pedidos** - Vazia (para pedidos)
5. ✅ **itens_pedido** - Vazia
6. ✅ **log_sms** - Vazia

### Dados Iniciais:
- **Mesas:** 1 a 10 com QR tokens únicos
- **Produtos:** 6 pratos, 6 bebidas, 3 sobremesas
- **Admin:** admin@lanchonete.mz / admin123

---

## ⚠️ Importante

### Segurança
- ✅ Senha já está no `.env` (não commitar!)
- ✅ `.gitignore` já protege o `.env`
- ✅ Conexão SSL automática (Render)

### Performance
- ✅ Índices criados automaticamente
- ✅ Conexão pooling (Prisma)
- ✅ Queries optimizadas

---

## 🔧 Comandos Úteis

### Prisma
```bash
# Ver schema atual
npx prisma db pull

# Sincronizar schema
npx prisma db push

# Gerar client
npx prisma generate

# Abrir studio
npx prisma studio

# Reset (CUIDADO: apaga tudo!)
npx prisma db push --force-reset
```

### Backup
```bash
# Fazer backup
pg_dump "postgresql://txopela_user:QbElw4O9jqyL7V7qql8kKWwF0qZ0F75h@dpg-d81napl0lvsc73fme010-a.oregon-postgres.render.com/txopela_tour" > backup.sql

# Restaurar backup
psql "postgresql://..." < backup.sql
```

---

## 🚀 Deploy Completo

Quando estiveres pronto para deploy:

### Backend (Render)
```bash
# 1. Push código para GitHub
git add .
git commit -m "Backend completo"
git push

# 2. Criar Web Service no Render
# - Connect repository
# - Build: npm install
# - Start: npm start
# - Add environment variables do .env

# 3. Deploy automático
```

### Frontend Cliente (Vercel)
```bash
cd frontend/cliente

# Build
npm run build

# Deploy
vercel --prod
```

### Frontend Painel (Vercel)
```bash
cd frontend/painel

# Build
npm run build

# Deploy
vercel --prod
```

---

## ✅ Checklist

- [x] Base de dados Render configurada
- [x] `.env` actualizado
- [ ] Executar `npx prisma db push`
- [ ] Executar `npm run db:seed`
- [ ] Testar `npm run dev`
- [ ] Verificar `npx prisma studio`
- [ ] Testar API endpoints
- [ ] Gerar QR codes: `npm run gerar:qr`

---

## 📞 Suporte

### Render Dashboard
- URL: https://dashboard.render.com/
- Ver logs, métricas, backups

### Prisma Docs
- https://www.prisma.io/docs/

### Problemas Comuns

**Erro: "Can't reach database server"**
```bash
# Verificar se DATABASE_URL está correcto no .env
# Testar conexão:
npx prisma db pull
```

**Erro: "SSL connection required"**
```bash
# Adicionar ao DATABASE_URL:
?sslmode=require
```

**Erro: "Too many connections"**
```bash
# Render free tier: 97 conexões
# Prisma usa connection pooling automático
# Verificar se não tens múltiplas instâncias rodando
```

---

## 🎉 Pronto!

Tua base de dados Render está configurada e pronta para usar!

**Próximo comando:**
```bash
npx prisma db push && npm run db:seed && npm run dev
```

**Tempo total:** ~3 minutos ⚡
