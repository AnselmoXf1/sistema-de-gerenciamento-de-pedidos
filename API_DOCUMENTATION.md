# 📡 Documentação da API - Lanchonete Digital

## Base URL
```
http://localhost:3000/api
```

---

## 🔐 Autenticação

### POST /api/auth/login
Login da dona/funcionária. Retorna token JWT.

**Request:**
```json
{
  "email": "admin@lanchonete.mz",
  "senha": "admin123"
}
```

**Response (200):**
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

**Erros:**
- `400` - Email/senha não fornecidos
- `401` - Credenciais inválidas
- `403` - Usuário inactivo

**Rate Limit:** 5 tentativas por 15 minutos

---

### POST /api/auth/registar
Registar novo usuário (apenas desenvolvimento).

**Request:**
```json
{
  "nome": "Maria Silva",
  "email": "maria@lanchonete.mz",
  "senha": "senha123",
  "role": "funcionaria"
}
```

**Response (201):**
```json
{
  "sucesso": true,
  "usuario": {
    "id": 2,
    "nome": "Maria Silva",
    "email": "maria@lanchonete.mz",
    "role": "funcionaria"
  }
}
```

**Nota:** Desactivado em produção (`NODE_ENV=production`)

---

## 🍔 Cardápio

### GET /api/cardapio
Lista todos os produtos disponíveis. **Público** (sem autenticação).

**Response (200):**
```json
{
  "produtos": [
    {
      "id": 1,
      "nome": "Hambúrguer Clássico",
      "descricao": "Pão, carne, queijo, alface, tomate",
      "preco": "250.00",
      "categoria": "prato",
      "emoji": "🍔",
      "imagemUrl": null
    }
  ],
  "porCategoria": {
    "prato": [...],
    "bebida": [...],
    "sobremesa": [...]
  },
  "total": 15
}
```

---

### GET /api/cardapio/:id
Busca produto específico.

**Response (200):**
```json
{
  "id": 1,
  "nome": "Hambúrguer Clássico",
  "descricao": "Pão, carne, queijo, alface, tomate",
  "preco": "250.00",
  "categoria": "prato",
  "emoji": "🍔",
  "disponivel": true,
  "ordem": 1,
  "criadoEm": "2026-05-16T10:00:00.000Z"
}
```

**Erros:**
- `404` - Produto não encontrado

---

## 🪑 Mesas

### GET /api/pedidos/mesa/:id/validar
Valida mesa pelo token do QR code. **Público**.

**Query Params:**
- `token` (required) - Token único da mesa

**Exemplo:**
```
GET /api/pedidos/mesa/1/validar?token=abc123xyz
```

**Response (200):**
```json
{
  "valida": true,
  "mesa": {
    "id": 1,
    "numero": 4
  }
}
```

**Erros:**
- `404` - Mesa não encontrada ou token inválido
- `403` - Mesa inactiva

---

## 📋 Pedidos (Cliente)

### POST /api/pedidos
Cria novo pedido. **Público**.

**Request:**
```json
{
  "mesaId": 1,
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2
    },
    {
      "produtoId": 7,
      "quantidade": 1
    }
  ],
  "formaPagamento": "mpesa",
  "smsOptIn": true,
  "telefoneSms": "+258841234567",
  "observacoes": "Sem cebola"
}
```

**Campos:**
- `mesaId` (required) - ID da mesa
- `itens` (required) - Array de produtos e quantidades
- `formaPagamento` (required) - `mpesa`, `emola` ou `dinheiro`
- `smsOptIn` (optional) - Receber SMS (default: false)
- `telefoneSms` (required se smsOptIn=true) - Formato: +258XXXXXXXXX
- `observacoes` (optional) - Notas adicionais

**Response (201):**
```json
{
  "sucesso": true,
  "pedido": {
    "id": 42,
    "ticketNum": "P-042",
    "totalMt": "550.00",
    "status": "aguardando",
    "mesaNumero": 4
  },
  "mensagem": "Pedido P-042 criado com sucesso!"
}
```

**Erros:**
- `400` - Dados inválidos
- `404` - Mesa ou produto não encontrado
- `500` - Erro ao criar pedido

**Rate Limit:** 10 pedidos por hora por IP

**Notificações:**
- Envia evento Socket.io `novo-pedido` para o painel
- Envia SMS de confirmação (se opt-in activado)

---

### GET /api/pedidos/:ticketNum
Busca pedido pelo número do ticket. **Público**.

**Exemplo:**
```
GET /api/pedidos/P-042
```

**Response (200):**
```json
{
  "ticketNum": "P-042",
  "status": "em_preparo",
  "totalMt": "550.00",
  "mesaNumero": 4,
  "criadoEm": "2026-05-16T14:30:00.000Z",
  "itens": [
    {
      "produto": "Hambúrguer Clássico",
      "quantidade": 2,
      "subtotal": "500.00"
    },
    {
      "produto": "Coca-Cola 500ml",
      "quantidade": 1,
      "subtotal": "50.00"
    }
  ]
}
```

**Erros:**
- `404` - Pedido não encontrado

---

## 👩‍💼 Painel da Dona (Autenticado)

**Todas as rotas abaixo requerem autenticação JWT.**

**Header obrigatório:**
```
Authorization: Bearer <token>
```

---

### GET /api/painel/pedidos
Lista pedidos activos (aguardando, em preparo, pronto).

**Response (200):**
```json
{
  "pedidos": [
    {
      "id": 42,
      "ticketNum": "P-042",
      "status": "aguardando",
      "totalMt": "550.00",
      "formaPagamento": "mpesa",
      "smsOptIn": true,
      "telefoneSms": "+258 84 ***-*567",
      "smsEnviado": false,
      "observacoes": "Sem cebola",
      "criadoEm": "2026-05-16T14:30:00.000Z",
      "mesa": {
        "id": 1,
        "numero": 4
      },
      "itens": [
        {
          "id": 1,
          "quantidade": 2,
          "precoUnit": "250.00",
          "subtotal": "500.00",
          "produto": {
            "id": 1,
            "nome": "Hambúrguer Clássico",
            "emoji": "🍔"
          }
        }
      ]
    }
  ],
  "total": 3
}
```

**Nota:** Números de telefone são mascarados para privacidade.

---

### PATCH /api/painel/pedidos/:id
Actualiza status do pedido.

**Request:**
```json
{
  "status": "em_preparo"
}
```

**Status válidos:**
- `aguardando` - Pedido recebido
- `em_preparo` - Em preparação
- `pronto` - Pronto para buscar
- `entregue` - Entregue ao cliente
- `cancelado` - Cancelado

**Response (200):**
```json
{
  "sucesso": true,
  "pedido": { ... },
  "mensagem": "Pedido actualizado para: em_preparo"
}
```

**Comportamento especial:**
- Ao mudar para `pronto`: envia SMS automaticamente (se opt-in)
- Emite evento Socket.io `pedido-actualizado`

**Erros:**
- `400` - Status inválido
- `404` - Pedido não encontrado
- `401` - Não autenticado

---

### POST /api/painel/pedidos/:id/notificar
Envia SMS manual para o cliente.

**Response (200):**
```json
{
  "sucesso": true,
  "mensagem": "SMS enviado com sucesso"
}
```

**Erros:**
- `400` - Cliente não fez opt-in ou SMS já enviado
- `404` - Pedido não encontrado
- `500` - Erro ao enviar SMS

**Rate Limit:** 3 SMS por minuto

---

### GET /api/painel/historico
Busca histórico de pedidos.

**Query Params (opcionais):**
- `dataInicio` - Data início (ISO 8601)
- `dataFim` - Data fim (ISO 8601)
- `status` - Filtrar por status

**Exemplo:**
```
GET /api/painel/historico?dataInicio=2026-05-16&status=entregue
```

**Response (200):**
```json
{
  "pedidos": [ ... ],
  "total": 45
}
```

---

### GET /api/painel/relatorios/dia
Gera relatório do dia.

**Query Params (opcional):**
- `data` - Data do relatório (default: hoje)

**Exemplo:**
```
GET /api/painel/relatorios/dia?data=2026-05-16
```

**Response (200):**
```json
{
  "data": "2026-05-16",
  "totalPedidos": 45,
  "pedidosEntregues": 42,
  "pedidosCancelados": 3,
  "facturacao": 12500.00,
  "ticketMedio": 297.62,
  "porFormaPagamento": {
    "mpesa": 7500.00,
    "emola": 3000.00,
    "dinheiro": 2000.00
  }
}
```

---

## 🔌 WebSocket (Socket.io)

### Conexão
```javascript
const socket = io('http://localhost:3000');
```

### Eventos do Cliente → Servidor

#### entrar-painel
Cliente entra na sala do painel para receber actualizações.

```javascript
socket.emit('entrar-painel');
```

### Eventos do Servidor → Cliente

#### novo-pedido
Novo pedido foi criado.

```javascript
socket.on('novo-pedido', (pedido) => {
  console.log('Novo pedido:', pedido);
  // Actualizar interface
  // Tocar som de notificação
});
```

**Payload:**
```json
{
  "id": 42,
  "ticketNum": "P-042",
  "status": "aguardando",
  "totalMt": "550.00",
  "mesa": { ... },
  "itens": [ ... ]
}
```

#### pedido-actualizado
Status de pedido foi actualizado.

```javascript
socket.on('pedido-actualizado', (pedido) => {
  console.log('Pedido actualizado:', pedido);
  // Actualizar interface
});
```

---

## 🧪 Testes com cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lanchonete.mz","senha":"admin123"}'
```

### Buscar Cardápio
```bash
curl http://localhost:3000/api/cardapio
```

### Criar Pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "mesaId": 1,
    "itens": [{"produtoId": 1, "quantidade": 2}],
    "formaPagamento": "dinheiro",
    "smsOptIn": false
  }'
```

### Listar Pedidos (autenticado)
```bash
curl http://localhost:3000/api/painel/pedidos \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Actualizar Status
```bash
curl -X PATCH http://localhost:3000/api/painel/pedidos/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"status":"pronto"}'
```

---

## 📊 Códigos de Status HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Não autenticado |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro do servidor |

---

## 🔒 Segurança

### Rate Limiting

| Endpoint | Limite |
|----------|--------|
| POST /api/auth/login | 5 por 15 min |
| POST /api/pedidos | 10 por hora |
| POST /api/painel/*/notificar | 3 por minuto |

### Headers de Segurança (Helmet.js)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (em produção)

### Validações
- Inputs sanitizados
- Telefones validados (formato MZ)
- Status de pedido validados
- Formas de pagamento validadas

---

## 📝 Notas Importantes

1. **Tokens JWT:** Expiram em 8 horas (configurável)
2. **SMS:** Apenas enviados se cliente fez opt-in
3. **Telefones:** Mascarados após uso para privacidade
4. **WebSocket:** Actualização em tempo real para o painel
5. **CORS:** Configurado para aceitar requisições do frontend

---

## 🚀 Colecção Postman

Importa esta colecção para testar a API:

```json
{
  "info": {
    "name": "Lanchonete Digital API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@lanchonete.mz\",\n  \"senha\": \"admin123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

**Documentação gerada em:** 16 de Maio de 2026  
**Versão da API:** 1.0.0
