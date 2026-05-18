# ⚡ Comandos para Iniciar - Copy & Paste

## 🚀 Inicialização Rápida (3 Terminais)

### **Terminal 1: Backend**
```bash
npm run dev
```

### **Terminal 2: Frontend Cliente**
```bash
cd frontend/cliente
npm run dev
```

### **Terminal 3: Frontend Painel**
```bash
cd frontend/painel
npm run dev
```

---

## 🌐 URLs Depois de Iniciar

- **Backend API:** http://localhost:3000
- **Cliente (PWA):** http://localhost:5173
- **Painel (Admin):** http://localhost:5174

---

## 🔑 Credenciais de Teste

**Login Painel:**
- Email: `admin@lanchonete.mz`
- Senha: `admin123`

---

## 📱 Gerar QR Codes

```bash
npm run gerar:qr
```

Depois abra: `qr_codes/imprimir_todos.html`

---

## 🧪 Testar API

```bash
# Health check
curl http://localhost:3000/health

# Cardápio
curl http://localhost:3000/api/cardapio

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@lanchonete.mz\",\"senha\":\"admin123\"}"
```

---

## 🔄 Se Precisar Reinstalar

```bash
# Limpar tudo
rm -rf node_modules frontend/cliente/node_modules frontend/painel/node_modules
rm package-lock.json frontend/cliente/package-lock.json frontend/painel/package-lock.json

# Reinstalar
npm install
cd frontend/cliente && npm install
cd ../painel && npm install
cd ../..

# Recriar base de dados
npx prisma db push
npm run db:seed

# Iniciar
npm run dev
```

---

## 📊 Ver Base de Dados

```bash
npx prisma studio
```

Abre em: http://localhost:5555

---

## 🎯 Fluxo de Teste Rápido

1. Iniciar backend: `npm run dev`
2. Iniciar cliente: `cd frontend/cliente && npm run dev`
3. Iniciar painel: `cd frontend/painel && npm run dev`
4. Gerar QR: `npm run gerar:qr`
5. Abrir painel: http://localhost:5174 (login)
6. Abrir QR da Mesa 1 (do ficheiro HTML)
7. Fazer pedido
8. Ver no painel em tempo real

---

**Tempo total:** 2 minutos ⚡
