# 🧪 Testes Rápidos - Validação do Sistema

Este guia permite testar rapidamente todas as funcionalidades implementadas.

## 🚀 Pré-requisitos

```bash
# 1. Backend rodando
npm run dev

# 2. Base de dados populada
npm run db:seed

# 3. Frontend rodando (opcional)
cd frontend/cliente && npm run dev
```

---

## ✅ Teste 1: Health Check

### Verificar se o servidor está rodando

```bash
curl http://localhost:3000/health
```

**Resultado esperado:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-16T...",
  "uptime": 123.456
}
```

---

## ✅ Teste 2: Autenticação

### 2.1 Login com credenciais correctas

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lanchonete.mz",
    "senha": "admin123"
  }'
```

**Resultado esperado:**
```json
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "Administrador",
    "email": "admin@lanchonete.mz",
    "role": "dona"
  }
}
```

**✅ PASSOU** se recebeste o token

**❌ FALHOU** se:
- Erro 401: Credenciais inválidas
- Erro 500: Problema no servidor

### 2.2 Login com credenciais erradas

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lanchonete.mz",
    "senha": "senha_errada"
  }'
```

**Resultado esperado:**
```json
{
  "erro": "Credenciais inválidas"
}
```

**✅ PASSOU** se recebeste erro 401

### 2.3 Guardar o token

```bash
# Guarda o token numa variável
export TOKEN="cole_o_token_aqui"
```

---

## ✅ Teste 3: Cardápio

### 3.1 Listar todos os produtos

```bash
curl http://localhost:3000/api/cardapio
```

**Resultado esperado:**
- Array de produtos
- Produtos agrupados por categoria
- Total de produtos

**✅ PASSOU** se viste produtos como:
- Hambúrguer Clássico
- Coca-Cola
- Gelado

### 3.2 Buscar produto específico

```bash
curl http://localhost:3000/api/cardapio/1
```

**Resultado esperado:**
```json
{
  "id": 1,
  "nome": "Hambúrguer Clássico",
  "preco": "250.00",
  ...
}
```

**✅ PASSOU** se viste os detalhes do produto

---

## ✅ Teste 4: Validação de Mesa

### 4.1 Buscar token da mesa

```bash
# Abrir Prisma Studio
npm run db:studio

# Ou via SQL
psql -U postgres -d lanchonete_db -c "SELECT id, numero, qr_token FROM mesas LIMIT 1;"
```

Copia o `id` e `qr_token` da primeira mesa.

### 4.2 Validar mesa

```bash
# Substitui :id e :token pelos valores reais
curl "http://localhost:3000/api/pedidos/mesa/1/validar?token=SEU_TOKEN_AQUI"
```

**Resultado esperado:**
```json
{
  "valida": true,
  "mesa": {
    "id": 1,
    "numero": 1
  }
}
```

**✅ PASSOU** se `valida: true`

**❌ FALHOU** se:
- `valida: false` - Token inválido
- Erro 404 - Mesa não encontrada

---

## ✅ Teste 5: Criar Pedido

### 5.1 Pedido simples (sem SMS)

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "mesaId": 1,
    "itens": [
      {"produtoId": 1, "quantidade": 2},
      {"produtoId": 7, "quantidade": 1}
    ],
    "formaPagamento": "dinheiro",
    "smsOptIn": false
  }'
```

**Resultado esperado:**
```json
{
  "sucesso": true,
  "pedido": {
    "id": 1,
    "ticketNum": "P-...",
    "totalMt": "550.00",
    "status": "aguardando",
    "mesaNumero": 1
  },
  "mensagem": "Pedido P-... criado com sucesso!"
}
```

**✅ PASSOU** se:
- Recebeste `ticketNum`
- Status é `aguardando`
- Total está correcto

**Guarda o ticketNum:**
```bash
export TICKET="P-..."
```

### 5.2 Pedido com SMS (teste validação)

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "mesaId": 1,
    "itens": [{"produtoId": 1, "quantidade": 1}],
    "formaPagamento": "mpesa",
    "smsOptIn": true,
    "telefoneSms": "+258841234567"
  }'
```

**✅ PASSOU** se pedido foi criado com opt-in activado

### 5.3 Pedido inválido (sem itens)

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "mesaId": 1,
    "itens": [],
    "formaPagamento": "dinheiro"
  }'
```

**Resultado esperado:**
```json
{
  "erro": "Mesa e itens são obrigatórios"
}
```

**✅ PASSOU** se recebeste erro 400

---

## ✅ Teste 6: Buscar Pedido

```bash
curl http://localhost:3000/api/pedidos/$TICKET
```

**Resultado esperado:**
```json
{
  "ticketNum": "P-...",
  "status": "aguardando",
  "totalMt": "550.00",
  "mesaNumero": 1,
  "itens": [...]
}
```

**✅ PASSOU** se viste os detalhes do pedido

---

## ✅ Teste 7: Painel da Dona (Autenticado)

### 7.1 Listar pedidos activos

```bash
curl http://localhost:3000/api/painel/pedidos \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "pedidos": [...],
  "total": 2
}
```

**✅ PASSOU** se viste os pedidos criados

**❌ FALHOU** se:
- Erro 401: Token inválido ou expirado
- Array vazio: Nenhum pedido activo

### 7.2 Tentar sem autenticação

```bash
curl http://localhost:3000/api/painel/pedidos
```

**Resultado esperado:**
```json
{
  "erro": "Token não fornecido"
}
```

**✅ PASSOU** se recebeste erro 401

### 7.3 Actualizar status do pedido

```bash
# Busca o ID do primeiro pedido
curl http://localhost:3000/api/painel/pedidos \
  -H "Authorization: Bearer $TOKEN" | grep -o '"id":[0-9]*' | head -1

# Actualiza para "em_preparo"
curl -X PATCH http://localhost:3000/api/painel/pedidos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"em_preparo"}'
```

**Resultado esperado:**
```json
{
  "sucesso": true,
  "pedido": {...},
  "mensagem": "Pedido actualizado para: em_preparo"
}
```

**✅ PASSOU** se status mudou

### 7.4 Marcar como pronto (trigger SMS)

```bash
curl -X PATCH http://localhost:3000/api/painel/pedidos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"pronto"}'
```

**Resultado esperado:**
- Pedido actualizado
- SMS enviado (se opt-in activado)
- Log no terminal do servidor

**✅ PASSOU** se:
- Status mudou para `pronto`
- Viste log de SMS no terminal

---

## ✅ Teste 8: Relatório do Dia

```bash
curl http://localhost:3000/api/painel/relatorios/dia \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "data": "2026-05-16",
  "totalPedidos": 2,
  "pedidosEntregues": 0,
  "pedidosCancelados": 0,
  "facturacao": 0,
  "ticketMedio": 0,
  "porFormaPagamento": {}
}
```

**✅ PASSOU** se viste o relatório

---

## ✅ Teste 9: Histórico

```bash
curl "http://localhost:3000/api/painel/historico?status=aguardando" \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "pedidos": [...],
  "total": 1
}
```

**✅ PASSOU** se viste pedidos filtrados

---

## ✅ Teste 10: SMS Manual

```bash
# Busca ID de um pedido com SMS opt-in
curl -X POST http://localhost:3000/api/painel/pedidos/2/notificar \
  -H "Authorization: Bearer $TOKEN"
```

**Resultado esperado:**
```json
{
  "sucesso": true,
  "mensagem": "SMS enviado com sucesso"
}
```

**OU** (se não tem opt-in):
```json
{
  "sucesso": false,
  "erro": "opt-in desactivado ou já enviado"
}
```

**✅ PASSOU** se:
- SMS enviado (com opt-in)
- Erro apropriado (sem opt-in)

---

## ✅ Teste 11: Rate Limiting

### 11.1 Testar limite de login

```bash
# Executar 6 vezes seguidas
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@lanchonete.mz","senha":"errada"}'
  echo "\nTentativa $i"
done
```

**Resultado esperado:**
- Primeiras 5: Erro 401
- 6ª tentativa: Erro 429 (Too Many Requests)

**✅ PASSOU** se 6ª tentativa foi bloqueada

### 11.2 Testar limite de pedidos

```bash
# Criar 11 pedidos seguidos
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/pedidos \
    -H "Content-Type: application/json" \
    -d '{
      "mesaId": 1,
      "itens": [{"produtoId": 1, "quantidade": 1}],
      "formaPagamento": "dinheiro",
      "smsOptIn": false
    }'
  echo "\nPedido $i"
done
```

**Resultado esperado:**
- Primeiros 10: Sucesso
- 11º pedido: Erro 429

**✅ PASSOU** se 11º pedido foi bloqueado

---

## ✅ Teste 12: Validações

### 12.1 Forma de pagamento inválida

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "mesaId": 1,
    "itens": [{"produtoId": 1, "quantidade": 1}],
    "formaPagamento": "bitcoin"
  }'
```

**Resultado esperado:**
```json
{
  "erro": "Forma de pagamento inválida..."
}
```

**✅ PASSOU** se recebeste erro 400

### 12.2 Telefone inválido

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "mesaId": 1,
    "itens": [{"produtoId": 1, "quantidade": 1}],
    "formaPagamento": "mpesa",
    "smsOptIn": true,
    "telefoneSms": "123"
  }'
```

**Resultado esperado:**
```json
{
  "erro": "Número de telefone inválido..."
}
```

**✅ PASSOU** se recebeste erro 400

### 12.3 Status inválido

```bash
curl -X PATCH http://localhost:3000/api/painel/pedidos/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"invalido"}'
```

**Resultado esperado:**
```json
{
  "erro": "Status inválido"
}
```

**✅ PASSOU** se recebeste erro 400

---

## ✅ Teste 13: QR Codes

```bash
# Gerar QR codes
npm run gerar:qr
```

**Verificar:**
1. Pasta `qr_codes/` foi criada
2. Ficheiros PNG gerados (mesa_1.png, mesa_2.png, etc.)
3. Ficheiro `imprimir_todos.html` criado

**Abrir HTML:**
```bash
# Windows
start qr_codes/imprimir_todos.html

# Linux/Mac
open qr_codes/imprimir_todos.html
```

**✅ PASSOU** se:
- QR codes foram gerados
- HTML abre no browser
- QR codes são escaneáveis

---

## ✅ Teste 14: Frontend Cliente

### 14.1 Iniciar frontend

```bash
cd frontend/cliente
npm run dev
```

### 14.2 Testar no browser

1. Abre: `http://localhost:5173`
2. Deve mostrar mensagem para escanear QR

3. Abre uma mesa (substitui token):
```
http://localhost:5173/mesa/1?token=SEU_TOKEN_AQUI
```

4. Deve mostrar o cardápio

**✅ PASSOU** se:
- Cardápio carrega
- Podes adicionar produtos
- Carrinho aparece
- Podes fazer pedido completo

---

## ✅ Teste 15: Socket.io (Tempo Real)

### 15.1 Abrir console do browser

1. Abre: `http://localhost:3000`
2. Abre DevTools (F12)
3. Vai em Console
4. Cola:

```javascript
const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('✅ Conectado:', socket.id);
  socket.emit('entrar-painel');
});

socket.on('novo-pedido', (pedido) => {
  console.log('🆕 Novo pedido:', pedido);
});

socket.on('pedido-actualizado', (pedido) => {
  console.log('🔄 Pedido actualizado:', pedido);
});
```

### 15.2 Criar pedido via cURL

```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "mesaId": 1,
    "itens": [{"produtoId": 1, "quantidade": 1}],
    "formaPagamento": "dinheiro",
    "smsOptIn": false
  }'
```

**✅ PASSOU** se viste no console:
```
🆕 Novo pedido: {...}
```

---

## 📊 Resumo dos Testes

### Checklist Rápida

- [ ] Health check funciona
- [ ] Login funciona
- [ ] Cardápio lista produtos
- [ ] Mesa valida correctamente
- [ ] Pedido é criado
- [ ] Pedido é buscado
- [ ] Painel lista pedidos (autenticado)
- [ ] Status é actualizado
- [ ] Relatório é gerado
- [ ] Rate limiting funciona
- [ ] Validações funcionam
- [ ] QR codes são gerados
- [ ] Frontend carrega
- [ ] Socket.io funciona

### Resultado Final

**Total de testes:** 15  
**Passaram:** ___  
**Falharam:** ___

---

## 🐛 Problemas Comuns

### Erro: "Cannot connect to database"
```bash
# Verificar se PostgreSQL está rodando
psql -U postgres -c "SELECT 1"

# Verificar .env
cat .env | grep DATABASE_URL
```

### Erro: "Token inválido"
```bash
# Fazer login novamente
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lanchonete.mz","senha":"admin123"}'
```

### Erro: "Port already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 🎉 Próximos Passos

Se todos os testes passaram:

1. ✅ Backend está 100% funcional
2. ✅ Podes começar a usar o sistema
3. ✅ Podes fazer deploy
4. ⚠️ Falta criar frontend do painel da dona

---

**Última actualização:** 16 de Maio de 2026
