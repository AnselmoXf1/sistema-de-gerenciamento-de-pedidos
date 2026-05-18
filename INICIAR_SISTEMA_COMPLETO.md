# 🚀 Iniciar Sistema Completo - Lanchonete Digital

## 📋 Guia Rápido de Inicialização

Este guia mostra como iniciar **Backend + Frontend Cliente + Frontend Painel** juntos.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se que:

- [ ] Node.js instalado (v18+)
- [ ] PostgreSQL configurado (Render)
- [ ] Dependências instaladas
- [ ] Base de dados populada

---

## 🎯 Opção 1: Iniciar Tudo de Uma Vez (Recomendado)

### **Windows PowerShell**

Abra **3 terminais** no VS Code (`Ctrl+Shift+`):

#### **Terminal 1: Backend**
```powershell
npm run dev
```

#### **Terminal 2: Frontend Cliente**
```powershell
cd frontend/cliente
npm run dev
```

#### **Terminal 3: Frontend Painel**
```powershell
*985369*****99666633.3699*63

*
npm run dev
```

---

## 🎯 Opção 2: Script Automático (Avançado)

### **Criar Script de Inicialização**

Criar `start-all.ps1`:

```powershell
# start-all.ps1
Write-Host "🚀 Iniciando Lanchonete Digital..." -ForegroundColor Green

# Terminal 1: Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Terminal 2: Frontend Cliente
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend\cliente'; npm run dev"

# Terminal 3: Frontend Painel
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend\painel'; npm run dev"

Write-Host "✅ Todos os serviços iniciados!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Backend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "👥 Cliente: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📊 Painel: http://localhost:5174" -ForegroundColor Cyan
```

### **Executar Script**

```powershell
.\start-all.ps1
```

---

## 📡 URLs do Sistema

Depois de iniciar, acesse:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Backend API** | http://localhost:3000 | API REST + Socket.io |
| **Frontend Cliente** | http://localhost:5173 | App PWA para clientes |
| **Frontend Painel** | http://localhost:5174 | Painel administrativo |
| **Prisma Studio** | http://localhost:5555 | Interface da base de dados |

---

## 🔍 Verificar se Está Funcionando

### **1. Backend**

Abra: http://localhost:3000

**Resposta esperada:**
```json
{
  "message": "🍔 Lanchonete Digital API",
  "version": "1.0.0",
  "endpoints": {
    "cardapio": "/api/cardapio",
    "pedidos": "/api/pedidos",
    "painel": "/api/painel",
    "auth": "/api/auth/login"
  }
}
```

### **2. Frontend Cliente**

Abra: http://localhost:5173

**Deve ver:**
- Página de erro (normal, precisa de QR code)
- Ou redirecionar para `/mesa/:id?token=...`

**Testar com mesa válida:**
1. Execute: `npm run gerar:qr`
2. Abra: `qr_codes/imprimir_todos.html`
3. Clique no link da Mesa 1
4. Deve carregar o cardápio

### **3. Frontend Painel**

Abra: http://localhost:5174

**Deve ver:**
- Página de login
- Campos: Email e Senha

**Testar login:**
- Email: `admin@lanchonete.mz`
- Senha: `admin123`
- Deve redirecionar para `/fila`

---

## 🐛 Problemas Comuns

### **Erro: "Port 3000 already in use"**

**Causa:** Backend já está rodando

**Solução:**
```powershell
# Encontrar processo
netstat -ano | findstr :3000

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Ou reiniciar
npm run dev
```

### **Erro: "Port 5173 already in use"**

**Causa:** Frontend Cliente já está rodando

**Solução:**
```powershell
# Parar processo (Ctrl+C no terminal)
# Ou mudar porta em vite.config.js
```

### **Erro: "Cannot connect to API"**

**Causa:** Backend não está rodando ou URL errada

**Solução:**
1. Verifique se backend está rodando: http://localhost:3000
2. Verifique `.env` nos frontends:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
3. Reinicie os frontends

### **Erro: "Database connection failed"**

**Causa:** PostgreSQL não conectado

**Solução:**
1. Verifique `.env` na raiz:
   ```
   DATABASE_URL="postgresql://txopela_user:..."
   ```
2. Teste conexão:
   ```bash
   npx prisma db push
   ```

### **Erro: "Module not found"**

**Causa:** Dependências não instaladas

**Solução:**
```powershell
# Raiz (backend)
npm install

# Frontend Cliente
cd frontend/cliente
npm install

# Frontend Painel
cd frontend/painel
npm install
```

---

## 📊 Logs e Monitoramento

### **Ver Logs do Backend**

No terminal do backend, você verá:

```
🚀 Servidor rodando na porta 3000
🌐 URL: http://localhost:3000
📡 Socket.io pronto para conexões em tempo real
✅ Ambiente: development
⚠️  Africa's Talking NÃO configurado - usando modo MOCK
```

### **Ver Logs do Frontend**

No terminal dos frontends, você verá:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### **Monitorar Requisições**

Abra **DevTools** no browser (`F12`):

- **Console:** Ver erros JavaScript
- **Network:** Ver requisições HTTP
- **Application:** Ver LocalStorage, Service Worker

---

## 🧪 Testar Conexão Backend ↔ Frontend

### **Teste 1: Cardápio**

1. Abra: http://localhost:5173
2. Acesse uma mesa válida (via QR code)
3. Deve carregar produtos do backend

**Verificar no DevTools:**
- Network → `cardapio` → Status: `200 OK`
- Response: Lista de produtos

### **Teste 2: Criar Pedido**

1. Adicione produtos ao carrinho
2. Clique "Ver Resumo"
3. Confirme pedido
4. Deve criar pedido no backend

**Verificar no DevTools:**
- Network → `pedidos` → Status: `201 Created`
- Response: `{ sucesso: true, pedido: {...} }`

### **Teste 3: Painel (Tempo Real)**

1. Abra painel: http://localhost:5174
2. Faça login
3. Abra cliente em outra aba
4. Crie um pedido
5. Pedido deve aparecer no painel **automaticamente**

**Verificar no DevTools (Painel):**
- Console → `✅ Cliente conectado: ...`
- Console → `📊 Cliente entrou no painel`
- Console → `🔔 Novo pedido recebido: ...`

---

## 🔄 Reiniciar Serviços

### **Reiniciar Backend**

```powershell
# No terminal do backend
Ctrl+C  # Parar
npm run dev  # Iniciar
```

### **Reiniciar Frontend**

```powershell
# No terminal do frontend
Ctrl+C  # Parar
npm run dev  # Iniciar
```

### **Reiniciar Tudo**

```powershell
# Parar todos (Ctrl+C em cada terminal)
# Executar script novamente
.\start-all.ps1
```

---

## 📱 Testar em Telemóvel (Mesma Rede)

### **1. Descobrir IP do Computador**

```powershell
ipconfig
```

Procure por: `IPv4 Address: 192.168.x.x`

### **2. Actualizar URLs**

**Backend `.env`:**
```env
BASE_URL=http://192.168.x.x:3000
```

**Frontend Cliente `.env`:**
```env
VITE_API_URL=http://192.168.x.x:3000/api
```

**Frontend Painel `.env`:**
```env
VITE_API_URL=http://192.168.x.x:3000/api
```

### **3. Reiniciar Serviços**

```powershell
# Parar todos (Ctrl+C)
# Iniciar novamente
npm run dev  # Backend
cd frontend/cliente && npm run dev  # Cliente
cd frontend/painel && npm run dev  # Painel
```

### **4. Acessar do Telemóvel**

- **Cliente:** http://192.168.x.x:5173
- **Painel:** http://192.168.x.x:5174

**Nota:** Computador e telemóvel devem estar na **mesma rede WiFi**

---

## 🎯 Fluxo de Teste Completo

### **Cenário: Pedido do Cliente → Painel**

1. **Abrir Painel** (http://localhost:5174)
   - Login: `admin@lanchonete.mz` / `admin123`
   - Deixar aberto na aba "Fila"

2. **Gerar QR Code**
   ```bash
   npm run gerar:qr
   ```
   - Abrir: `qr_codes/imprimir_todos.html`
   - Clicar no link da Mesa 1

3. **Fazer Pedido (Cliente)**
   - Adicionar: 1 Hambúrguer + 1 Coca-Cola
   - Forma de pagamento: M-Pesa
   - SMS: Não
   - Confirmar

4. **Ver no Painel**
   - Pedido aparece automaticamente
   - Alerta sonoro toca
   - Badge de contador actualiza

5. **Processar Pedido**
   - Clicar "Confirmar" → Status: Em Preparo
   - Clicar "Pronto" → Status: Pronto (SMS enviado)
   - Clicar "Entregue" → Status: Entregue

6. **Verificar Histórico**
   - Ir para aba "Histórico"
   - Ver pedido entregue
   - Ver total do dia

**Tempo total:** ~2 minutos ⏱️

---

## 📊 Monitorar Performance

### **Backend**

```bash
# Ver uso de memória
node --inspect backend/src/server.js

# Abrir Chrome DevTools
chrome://inspect
```

### **Frontend**

```bash
# Build de produção
cd frontend/cliente
npm run build

# Ver tamanho do bundle
ls -lh dist/assets
```

**Tamanho esperado:**
- Cliente: < 500 KB
- Painel: < 600 KB

---

## ✅ Checklist de Inicialização

- [ ] Backend rodando (porta 3000)
- [ ] Frontend Cliente rodando (porta 5173)
- [ ] Frontend Painel rodando (porta 5174)
- [ ] Backend conectado à base de dados
- [ ] Cardápio carrega no cliente
- [ ] Login funciona no painel
- [ ] Pedido criado com sucesso
- [ ] Tempo real funciona (Socket.io)
- [ ] SMS em modo mock (ou configurado)

---

## 🚀 Próximos Passos

Depois de iniciar o sistema:

1. **Gerar QR Codes:** `npm run gerar:qr`
2. **Testar Postman:** Importar `Lanchonete_Digital_API.postman_collection.json`
3. **Testes de Campo:** Seguir `GUIA_TESTES_CAMPO.md`
4. **Configurar SMS:** Seguir `CONFIGURAR_SMS_AFRICAS_TALKING.md`
5. **Deploy:** Seguir `CONFIGURAR_RENDER.md`

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs nos terminais
2. Verifique DevTools no browser (F12)
3. Consulte `COMANDOS_RAPIDOS.md`
4. Consulte `API_DOCUMENTATION.md`

---

**Tempo de inicialização:** 2-3 minutos ⏱️

**Terminais necessários:** 3 📟

**Portas usadas:** 3000, 5173, 5174 🔌
