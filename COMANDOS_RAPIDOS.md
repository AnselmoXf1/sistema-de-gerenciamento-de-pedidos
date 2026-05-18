# ⚡ Comandos Rápidos - Copy & Paste

## 🚀 Setup Inicial (3 minutos)

```bash
# 1. Instalar dependências
npm install

# 2. Criar tabelas no Render
npx prisma db push

# 3. Popular dados iniciais
npm run db:seed

# 4. Gerar Prisma Client
npx prisma generate

# 5. Rodar backend
npm run dev
```

---

## 🎨 Rodar Frontend

### Terminal 2 - Cliente
```bash
cd frontend/cliente
npm install
npm run dev
```

### Terminal 3 - Painel
```bash
cd frontend/painel
npm install
npm run dev
```

---

## 🔍 Verificar Base de Dados

```bash
# Abrir Prisma Studio (interface visual)
npx prisma studio

# Conectar via psql
psql "postgresql://txopela_user:QbElw4O9jqyL7V7qql8kKWwF0qZ0F75h@dpg-d81napl0lvsc73fme010-a.oregon-postgres.render.com/txopela_tour"
```

---

## 🧪 Testar API

```bash
# Health check
curl http://localhost:3000

# Cardápio
curl http://localhost:3000/api/cardapio

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lanchonete.mz","senha":"admin123"}'
```

---

## 📱 Gerar QR Codes

```bash
npm run gerar:qr

# QR codes salvos em: qr_codes/
# Abrir: qr_codes/imprimir_todos.html
```

---

## 🔄 Reset Base de Dados

```bash
# CUIDADO: Apaga tudo!
npx prisma db push --force-reset

# Popular novamente
npm run db:seed
```

---

## 📊 Ver Dados

```bash
# Prisma Studio (visual)
npx prisma studio

# psql (linha de comando)
psql "postgresql://txopela_user:QbElw4O9jqyL7V7qql8kKWwF0qZ0F75h@dpg-d81napl0lvsc73fme010-a.oregon-postgres.render.com/txopela_tour"

# Dentro do psql:
\dt                      # Listar tabelas
SELECT * FROM mesas;     # Ver mesas
SELECT * FROM produtos;  # Ver produtos
SELECT * FROM usuarios;  # Ver usuários
\q                       # Sair
```

---

## 🚀 URLs

- **API:** http://localhost:3000
- **Cliente:** http://localhost:5173
- **Painel:** http://localhost:5174
- **Prisma Studio:** http://localhost:5555

**Login Painel:**
- Email: `admin@lanchonete.mz`
- Senha: `admin123`

---

## 🎯 Comando Único (Tudo de Uma Vez)

```bash
npm install && npx prisma db push && npm run db:seed && npx prisma generate && npm run dev
```

**Tempo:** ~2 minutos ⚡
