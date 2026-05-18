# 🧪 Guia de Testes com Postman

## 📥 Importar Coleção

1. Abra o Postman
2. Clique em **Import**
3. Selecione o ficheiro: `Lanchonete_Digital_API.postman_collection.json`
4. Clique em **Import**

---

## ⚙️ Configurar Variáveis

A coleção já vem com variáveis configuradas:

| Variável | Valor Padrão | Descrição |
|----------|--------------|-----------|
| `base_url` | `http://localhost:3000` | URL da API |
| `token` | (auto) | Token JWT (preenchido automaticamente após login) |
| `pedido_id` | (auto) | ID do pedido (preenchido após criar pedido) |
| `ticket_num` | (auto) | Número do ticket (preenchido após criar pedido) |
| `mesa_id` | `1` | ID da mesa para testes |

---

## 🚀 Ordem de Execução Recomendada

### 1️⃣ **Verificar Servidor**
```
✅ Health Check - Sucesso
✅ Root - Info da API
```

### 2️⃣ **Autenticação**
```
✅ Login - Sucesso (salva token automaticamente)
❌ Login - Email Inválido
❌ Login - Senha Errada
❌ Login - Campos Vazios
```

**Credenciais:**
- Email: `admin@lanchonete.mz`
- Senha: `admin123`

### 3️⃣ **Cardápio (Público)**
```
✅ Listar Cardápio - Sucesso
✅ Buscar Produto por ID - Sucesso
❌ Buscar Produto - ID Inexistente
```

### 4️⃣ **Pedidos (Cliente)**
```
✅ Validar Mesa - Sucesso
❌ Validar Mesa - Token Inválido
✅ Criar Pedido - Sucesso (M-Pesa)
✅ Criar Pedido - Dinheiro (Sem SMS)
❌ Criar Pedido - Sem Itens
❌ Criar Pedido - Forma Pagamento Inválida
❌ Criar Pedido - Telefone Inválido
✅ Buscar Pedido por Ticket - Sucesso
❌ Buscar Pedido - Ticket Inexistente
```

### 5️⃣ **Painel (Admin - Requer Token)**
```
✅ Listar Pedidos Activos
❌ Listar Pedidos - Sem Token
❌ Listar Pedidos - Token Inválido
✅ Actualizar Status - Em Preparo
✅ Actualizar Status - Pronto
✅ Actualizar Status - Entregue
❌ Actualizar Status - Status Inválido
❌ Actualizar Status - Sem Autenticação
✅ Enviar SMS Manual
✅ Buscar Histórico - Hoje
✅ Buscar Histórico - Com Filtros
✅ Relatório do Dia - Hoje
✅ Relatório do Dia - Data Específica
```

---

## 🎯 Cenários de Teste Completos

### **Cenário 1: Fluxo Cliente Completo**

1. **Validar Mesa**
   - GET `/api/pedidos/mesa/1/validar?token=TOKEN_DA_MESA`
   - ✅ Espera: `200 OK` com `valida: true`

2. **Ver Cardápio**
   - GET `/api/cardapio`
   - ✅ Espera: `200 OK` com lista de produtos

3. **Criar Pedido**
   - POST `/api/pedidos`
   - Body:
     ```json
     {
       "mesaId": 1,
       "itens": [
         { "produtoId": 1, "quantidade": 2 },
         { "produtoId": 7, "quantidade": 2 }
       ],
       "formaPagamento": "mpesa",
       "smsOptIn": true,
       "telefoneSms": "+258843216789"
     }
     ```
   - ✅ Espera: `201 Created` com `ticketNum`

4. **Acompanhar Pedido**
   - GET `/api/pedidos/TICKET001`
   - ✅ Espera: `200 OK` com status do pedido

---

### **Cenário 2: Fluxo Painel (Dona)**

1. **Login**
   - POST `/api/auth/login`
   - Body:
     ```json
     {
       "email": "admin@lanchonete.mz",
       "senha": "admin123"
     }
     ```
   - ✅ Espera: `200 OK` com `token`

2. **Ver Pedidos Activos**
   - GET `/api/painel/pedidos`
   - Header: `Authorization: Bearer TOKEN`
   - ✅ Espera: `200 OK` com lista de pedidos

3. **Confirmar Pedido (Em Preparo)**
   - PATCH `/api/painel/pedidos/1`
   - Header: `Authorization: Bearer TOKEN`
   - Body:
     ```json
     {
       "status": "em_preparo"
     }
     ```
   - ✅ Espera: `200 OK`

4. **Marcar como Pronto**
   - PATCH `/api/painel/pedidos/1`
   - Body:
     ```json
     {
       "status": "pronto"
     }
     ```
   - ✅ Espera: `200 OK` + SMS enviado automaticamente

5. **Marcar como Entregue**
   - PATCH `/api/painel/pedidos/1`
   - Body:
     ```json
     {
       "status": "entregue"
     }
     ```
   - ✅ Espera: `200 OK`

6. **Ver Relatório do Dia**
   - GET `/api/painel/relatorios/dia`
   - ✅ Espera: `200 OK` com totais

---

### **Cenário 3: Testes de Erro**

#### **Autenticação**
- ❌ Login sem email/senha → `400 Bad Request`
- ❌ Login com email inexistente → `401 Unauthorized`
- ❌ Login com senha errada → `401 Unauthorized`
- ❌ Acesso ao painel sem token → `401 Unauthorized`
- ❌ Acesso com token inválido → `401 Unauthorized`

#### **Pedidos**
- ❌ Criar pedido sem itens → `400 Bad Request`
- ❌ Criar pedido com forma de pagamento inválida → `400 Bad Request`
- ❌ Criar pedido com telefone inválido → `400 Bad Request`
- ❌ Validar mesa com token errado → `404 Not Found`
- ❌ Buscar pedido inexistente → `404 Not Found`

#### **Painel**
- ❌ Actualizar status sem autenticação → `401 Unauthorized`
- ❌ Actualizar com status inválido → `400 Bad Request`
- ❌ Actualizar pedido inexistente → `404 Not Found`

---

## 🔄 Executar Todos os Testes

### **Opção 1: Runner do Postman**

1. Clique nos **3 pontos** ao lado da coleção
2. Selecione **Run collection**
3. Selecione todos os testes
4. Clique em **Run Lanchonete Digital API**
5. Veja os resultados

### **Opção 2: Newman (CLI)**

```bash
# Instalar Newman
npm install -g newman

# Executar coleção
newman run Lanchonete_Digital_API.postman_collection.json

# Com relatório HTML
newman run Lanchonete_Digital_API.postman_collection.json -r html
```

---

## 📊 Resultados Esperados

### **Casos de Sucesso (✅)**
- Status: `200 OK`, `201 Created`
- Response com dados corretos
- Token salvo automaticamente (login)
- IDs salvos automaticamente (pedidos)

### **Casos de Erro (❌)**
- Status: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- Response com mensagem de erro clara
- Sem dados sensíveis expostos

---

## 🔐 Obter Token da Mesa

Para testar validação de mesa, você precisa do `qrToken`:

### **Opção 1: Via Prisma Studio**
```bash
npx prisma studio
```
1. Abra `mesas`
2. Copie o `qrToken` da Mesa 1

### **Opção 2: Via Seed Output**
```bash
npm run db:seed
```
Copie a URL que aparece no console.

### **Opção 3: Via SQL**
```bash
psql "postgresql://txopela_user:QbElw4O9jqyL7V7qql8kKWwF0qZ0F75h@dpg-d81napl0lvsc73fme010-a.oregon-postgres.render.com/txopela_tour"

SELECT id, numero, qr_token FROM mesas WHERE numero = 1;
```

---

## 📱 Testar SMS

Para testar envio de SMS:

1. Configure Africa's Talking no `.env`:
   ```env
   AT_API_KEY=seu_api_key
   AT_USERNAME=seu_username
   AT_SENDER_ID=LanchFatima
   ```

2. Use número de teste: `+258843216789`

3. Crie pedido com `smsOptIn: true`

4. Marque como "pronto" → SMS enviado automaticamente

5. Ou use endpoint manual: `POST /api/painel/pedidos/:id/notificar`

---

## 🎯 Checklist de Testes

### **Backend**
- [ ] Health check funciona
- [ ] Login com credenciais corretas
- [ ] Login rejeita credenciais erradas
- [ ] Cardápio retorna produtos
- [ ] Criar pedido com M-Pesa
- [ ] Criar pedido com dinheiro
- [ ] Validar mesa com token correto
- [ ] Rejeitar mesa com token errado
- [ ] Listar pedidos activos (autenticado)
- [ ] Actualizar status do pedido
- [ ] Enviar SMS manual
- [ ] Buscar histórico
- [ ] Gerar relatório do dia
- [ ] Rejeitar acesso sem autenticação
- [ ] Retornar 404 para rotas inexistentes

### **Validações**
- [ ] Telefone moçambicano (+258)
- [ ] Forma de pagamento (mpesa, emola, dinheiro)
- [ ] Status do pedido (aguardando, em_preparo, pronto, entregue)
- [ ] Campos obrigatórios
- [ ] IDs válidos

### **Segurança**
- [ ] JWT expira após 8h
- [ ] Rotas protegidas requerem token
- [ ] Dados sensíveis mascarados
- [ ] Rate limiting funciona
- [ ] Helmet.js ativo

---

## 🚀 Próximos Passos

Depois de testar a API:

1. **Testar Frontend Cliente**
   - Abrir: `http://localhost:5173`
   - Escanear QR code
   - Fazer pedido completo

2. **Testar Frontend Painel**
   - Abrir: `http://localhost:5174`
   - Login: `admin@lanchonete.mz` / `admin123`
   - Gerenciar pedidos

3. **Testar Tempo Real**
   - Abrir painel em uma aba
   - Criar pedido em outra aba
   - Verificar se aparece automaticamente

4. **Stress Test**
   - Criar múltiplos pedidos simultâneos
   - Verificar performance
   - Monitorar logs

---

## 📞 Suporte

Se encontrar erros:

1. Verifique se o servidor está rodando: `npm run dev`
2. Verifique se a base de dados está conectada
3. Veja os logs do servidor no terminal
4. Consulte `API_DOCUMENTATION.md` para detalhes

---

**Tempo estimado de testes:** 15-20 minutos ⏱️

**Total de testes:** 40+ casos (sucesso + erro)
