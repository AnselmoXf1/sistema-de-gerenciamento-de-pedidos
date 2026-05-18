# Sistema de Gestão de Pedidos — Lanchonete Digital
## Documentação Técnica Completa · Moçambique

---

## Índice

1. [Visão Geral do Sistema](#1-visao-geral)
2. [Fluxo do Cliente](#2-fluxo-do-cliente)
3. [Fluxo da Dona / Painel de Gestão](#3-fluxo-da-dona)
4. [Arquitectura de Infraestrutura](#4-arquitectura)
5. [Base de Dados](#5-base-de-dados)
6. [Notificações SMS — Africa's Talking](#6-sms)
7. [Pagamentos — M-Pesa e e-Mola](#7-pagamentos)
8. [QR Codes por Mesa](#8-qr-codes)
9. [Stack Tecnológica Recomendada](#9-stack)
10. [Segurança](#10-seguranca)
11. [Plano de Implementação](#11-plano)
12. [Estimativa de Custos](#12-custos)

---

## 1. Visão Geral do Sistema

### Descrição

Sistema web de auto-serviço para lanchonetes em Moçambique. O cliente escaneia um QR code fixo na mesa, visualiza o cardápio, faz o pedido, paga (M-Pesa, e-Mola ou dinheiro) e escolhe se quer receber SMS de aviso. A dona recebe o pedido em tempo real, gere a fila de produção e notifica o cliente via SMS quando o pedido estiver pronto.

### Actores do Sistema

| Actor | Interface | Dispositivo típico |
|---|---|---|
| Cliente | Web app (PWA) — link via QR | Smartphone Android/iOS |
| Dona / Funcionária | Painel web de gestão | Tablet ou PC |
| Sistema | Backend + SMS gateway | Servidor na nuvem |

### Diagrama de Fluxo Geral

```
CLIENTE                          SISTEMA                        DONA
   │                                │                              │
   ├─ Escaneia QR da mesa ─────────►│                              │
   │◄─ Recebe cardápio ─────────────┤                              │
   ├─ Selecciona pratos / bebidas ──►│                              │
   ├─ Escolhe pagamento (M-Pesa etc)►│                              │
   ├─ Opt-in SMS (opcional) ────────►│                              │
   ├─ Confirma pedido ──────────────►│─── Notifica dona ───────────►│
   │◄─ Nº de ticket #P-XXX ─────────┤                              │
   │                                │◄── Confirma pedido ──────────┤
   │                                │◄── Marca "Em preparo" ───────┤
   │                                │◄── Marca "Pronto" ───────────┤
   │◄─ SMS: "Pedido #P-042 pronto!" ─┤                              │
   ├─ Vai buscar o pedido ──────────►│                              │
   └────────────────────────────────┘                              │
```

---

## 2. Fluxo do Cliente

### 2.1 Acesso via QR Code

Cada mesa tem um QR code único impresso ou colado. O QR aponta para:

```
https://seudominio.co.mz/mesa/4
```

O cliente escaneia com a câmara do telemóvel — **sem instalar nenhuma app**.

### 2.2 Telas da Interface do Cliente

#### Tela 1 — Cardápio
- Listagem de pratos e bebidas com emoji, nome, descrição curta e preço em MT
- Selector de quantidade por item (botões + e −)
- Barra de carrinho sticky na base (aparece quando há itens)
- Design leve, optimizado para 3G

#### Tela 2 — Resumo e Pagamento
- Lista dos itens seleccionados com subtotais
- Total em Meticais (MT)
- Escolha de forma de pagamento:
  - **M-Pesa** (Vodacom MZ) — predominante
  - **e-Mola** (mCel) — segunda mais usada
  - **Dinheiro vivo** — pagar na caixa
- Toggle: "Quero receber SMS quando o pedido estiver pronto"
  - Se activado → campo para introduzir número de telemóvel (+258)

#### Tela 3 — Confirmação
- Número do ticket (ex: #P-042)
- Mensagem de confirmação
- Instrução: aguardar SMS ou esperar ser chamado

### 2.3 Regras de Negócio — Cliente

- O cliente só confirma após escolher forma de pagamento
- SMS é opt-in — nunca obrigatório
- Número de ticket é gerado automaticamente e sequencial por dia
- Após confirmar, o cliente não pode alterar o pedido (volta a falar com a dona)

---

## 3. Fluxo da Dona / Painel de Gestão

### 3.1 Acesso ao Painel

URL protegido por login:
```
https://seudominio.co.mz/painel
```

Credenciais simples (email + senha) ou PIN de 4 dígitos para uso rápido no tablet.

### 3.2 Funcionalidades do Painel

#### Fila de Pedidos (tempo real)
- Actualização automática a cada 5 segundos (polling) ou via WebSocket
- Pedidos ordenados por hora de chegada
- Filtros por estado: **A aguardar** · **Em preparo** · **Pronto** · **Entregue**

#### Card de Pedido — Informações Visíveis
- Número do ticket (#P-XXX)
- Mesa de origem
- Hora do pedido
- Lista de itens com quantidades e preços
- Total em MT
- Forma de pagamento usada
- Indicador: "Cliente quer SMS" (com número mascarado)

#### Acções por Pedido

| Estado actual | Acção disponível | Resultado |
|---|---|---|
| A aguardar | Confirmar | Muda para "Em preparo" |
| Em preparo | Marcar pronto | Muda para "Pronto" + activa SMS |
| Qualquer | Enviar SMS manual | Envia alerta ao cliente |
| Pronto | Marcar entregue | Move para histórico |

#### Envio de SMS
- Ao marcar "Pronto": sistema envia SMS automaticamente se cliente fez opt-in
- Texto do SMS: `"Olá! O seu pedido #P-042 na Lanchonete da Fátima está pronto. Venha buscar! 😊"`
- A dona também pode enviar SMS manual com um toque

#### Histórico
- Aba separada com pedidos do dia
- Totais: nº de pedidos, facturação total do dia (MT)
- Filtro por data para consultar dias anteriores

### 3.3 Alertas Sonoros

- Novo pedido → som de notificação no browser
- Funciona mesmo com o ecrã em segundo plano (tab em background)

---

## 4. Arquitectura de Infraestrutura

### 4.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────┐
│                   CLIENTE                        │
│  Browser (PWA) · React ou HTML estático          │
│  seudominio.co.mz/mesa/:id                      │
└────────────────────┬────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────┐
│              SERVIDOR BACKEND                    │
│  Node.js + Express  OU  Python + FastAPI         │
│  Porta 443 (HTTPS)                               │
│                                                  │
│  /api/cardapio         GET  (público)            │
│  /api/pedidos          POST (público)            │
│  /api/pedidos/:id      PATCH (autenticado)       │
│  /api/painel/pedidos   GET  (autenticado)        │
│  /api/sms/enviar       POST (autenticado)        │
└──────┬──────────────────────┬───────────────────┘
       │                      │
┌──────▼──────┐    ┌──────────▼──────────────────┐
│  PostgreSQL  │    │    Africa's Talking (SMS)    │
│  Base dados  │    │    api.africastalking.com     │
└─────────────┘    └─────────────────────────────┘
```

### 4.2 Hospedagem Recomendada

#### Opção A — Railway.app (recomendado para início)
- Backend Node.js ou Python: plano gratuito suficiente para início
- PostgreSQL incluído
- Deploy automático via GitHub
- Custo: $0–5/mês no início

#### Opção B — DigitalOcean (mais robusto)
- Droplet $6/mês (1 vCPU, 1GB RAM)
- Managed PostgreSQL $15/mês
- Mais controlo, mais configuração

#### Opção C — Render.com
- Semelhante ao Railway
- Free tier disponível
- Custo: $0–7/mês

### 4.3 Domínio

Registar domínio `.co.mz` ou `.mz` no IANA/DNS moçambicano:
- Opções: `.co.mz` via regitradora local (ex: Teledata, Optimus)
- Custo aproximado: 500–1000 MT/ano
- Alternativa rápida: usar `seuapp.up.railway.app` gratuitamente para testes

### 4.4 Comunicação em Tempo Real

Para o painel da dona receber pedidos instantaneamente:

**Opção simples — Polling:**
```javascript
// Frontend do painel — actualiza a cada 5 segundos
setInterval(async () => {
  const res = await fetch('/api/painel/pedidos', { headers: { Authorization: token } });
  const pedidos = await res.json();
  renderFila(pedidos);
}, 5000);
```

**Opção avançada — WebSocket com Socket.io:**
```javascript
// Servidor
const io = require('socket.io')(server);
// Quando novo pedido chega:
io.emit('novo-pedido', pedido);

// Cliente (painel da dona)
socket.on('novo-pedido', (pedido) => {
  adicionarPedidoNaFila(pedido);
  tocarSomNotificacao();
});
```

---

## 5. Base de Dados

### 5.1 Modelo de Dados — PostgreSQL

#### Tabela: `mesas`
```sql
CREATE TABLE mesas (
  id          SERIAL PRIMARY KEY,
  numero      INTEGER NOT NULL UNIQUE,  -- ex: 4
  qr_token    VARCHAR(64) UNIQUE,       -- token único para o QR
  activa      BOOLEAN DEFAULT true,
  criado_em   TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: `produtos`
```sql
CREATE TABLE produtos (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100) NOT NULL,
  descricao   VARCHAR(255),
  preco       DECIMAL(10,2) NOT NULL,   -- em MT
  categoria   VARCHAR(50),              -- 'prato', 'bebida', 'sobremesa'
  emoji       VARCHAR(10),
  disponivel  BOOLEAN DEFAULT true,
  ordem       INTEGER DEFAULT 0,        -- ordem de exibição
  criado_em   TIMESTAMP DEFAULT NOW()
);
```

#### Tabela: `pedidos`
```sql
CREATE TABLE pedidos (
  id              SERIAL PRIMARY KEY,
  ticket_num      VARCHAR(20) UNIQUE,   -- ex: 'P-042'
  mesa_id         INTEGER REFERENCES mesas(id),
  status          VARCHAR(20) DEFAULT 'aguardando',
  -- status: aguardando | em_preparo | pronto | entregue | cancelado
  forma_pagamento VARCHAR(20),          -- 'mpesa' | 'emola' | 'dinheiro'
  total_mt        DECIMAL(10,2),
  sms_opt_in      BOOLEAN DEFAULT false,
  telefone_sms    VARCHAR(20),          -- número mascarado após uso
  sms_enviado     BOOLEAN DEFAULT false,
  criado_em       TIMESTAMP DEFAULT NOW(),
  confirmado_em   TIMESTAMP,
  pronto_em       TIMESTAMP,
  entregue_em     TIMESTAMP
);
```

#### Tabela: `itens_pedido`
```sql
CREATE TABLE itens_pedido (
  id          SERIAL PRIMARY KEY,
  pedido_id   INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id  INTEGER REFERENCES produtos(id),
  quantidade  INTEGER NOT NULL,
  preco_unit  DECIMAL(10,2) NOT NULL,   -- preço no momento do pedido
  subtotal    DECIMAL(10,2) NOT NULL
);
```

#### Tabela: `usuarios` (dona e funcionárias)
```sql
CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(100),
  email       VARCHAR(150) UNIQUE,
  senha_hash  VARCHAR(255),
  role        VARCHAR(20) DEFAULT 'funcionaria',  -- 'dona' | 'funcionaria'
  activo      BOOLEAN DEFAULT true,
  criado_em   TIMESTAMP DEFAULT NOW()
);
```

### 5.2 Queries Importantes

```sql
-- Fila de pedidos activos (ordenados por chegada)
SELECT p.*, m.numero as mesa_numero,
       json_agg(json_build_object(
         'produto', pr.nome,
         'quantidade', ip.quantidade,
         'subtotal', ip.subtotal
       )) as itens
FROM pedidos p
JOIN mesas m ON p.mesa_id = m.id
JOIN itens_pedido ip ON ip.pedido_id = p.id
JOIN produtos pr ON ip.produto_id = pr.id
WHERE p.status IN ('aguardando', 'em_preparo', 'pronto')
GROUP BY p.id, m.numero
ORDER BY p.criado_em ASC;

-- Facturação do dia
SELECT COUNT(*) as total_pedidos,
       SUM(total_mt) as facturacao_mt
FROM pedidos
WHERE DATE(criado_em) = CURRENT_DATE
  AND status = 'entregue';
```

---

## 6. Notificações SMS — Africa's Talking

### 6.1 Porquê Africa's Talking

- Cobertura em Moçambique: mCel, Vodacom MZ, Movitel
- API REST simples
- Painel de controlo com logs de entrega
- Preço por SMS em MZ: ~$0.02–0.04 USD por mensagem
- Documentação em português disponível

### 6.2 Configuração

```bash
# Instalar SDK
npm install africastalking
```

```javascript
// config/sms.js
const AfricasTalking = require('africastalking');

const at = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME  // ex: 'lanchonete_fatima'
});

const sms = at.SMS;

async function enviarSms(telefone, mensagem) {
  try {
    const resultado = await sms.send({
      to: [telefone],          // ex: '+258841234567'
      message: mensagem,
      from: 'LanchFatima'      // sender ID (solicitar à Africa's Talking)
    });
    console.log('SMS enviado:', resultado);
    return resultado;
  } catch (erro) {
    console.error('Erro SMS:', erro);
    throw erro;
  }
}

module.exports = { enviarSms };
```

### 6.3 Mensagens de SMS

#### Pedido confirmado (opcional)
```
Lanchonete da Fátima: Pedido #P-042 recebido! Estamos a preparar. Avisamos quando estiver pronto.
```

#### Pedido pronto — chamada para buscar
```
Lanchonete da Fátima: O seu pedido #P-042 está PRONTO! Venha buscar na caixa. Obrigada!
```

### 6.4 Endpoint de Envio SMS no Backend

```javascript
// routes/painel.js
router.post('/pedidos/:id/notificar', autenticar, async (req, res) => {
  const pedido = await db.query(
    'SELECT * FROM pedidos WHERE id = $1', [req.params.id]
  );

  if (!pedido.rows[0].sms_opt_in || pedido.rows[0].sms_enviado) {
    return res.json({ enviado: false, motivo: 'opt-in desactivado ou já enviado' });
  }

  const msg = `Lanchonete da Fátima: O seu pedido #${pedido.rows[0].ticket_num} está pronto! Venha buscar. Obrigada!`;

  await enviarSms(pedido.rows[0].telefone_sms, msg);

  await db.query(
    'UPDATE pedidos SET sms_enviado = true WHERE id = $1', [req.params.id]
  );

  res.json({ enviado: true });
});
```

### 6.5 Variáveis de Ambiente

```env
AT_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AT_USERNAME=lanchonete_fatima
```

---

## 7. Pagamentos — M-Pesa e e-Mola

### 7.1 Contexto Moçambicano

Em Moçambique, os pagamentos móveis são dominantes:
- **M-Pesa** (Vodacom MZ): maior base de utilizadores
- **e-Mola** (mCel): segunda plataforma
- **Dinheiro vivo**: sempre necessário como fallback

### 7.2 Opção Recomendada para Início: Pagamento Presencial

Para a fase inicial, o fluxo mais simples e sem burocracia é:

1. Cliente faz o pedido no sistema
2. Cliente vai à caixa pagar (M-Pesa, e-Mola ou dinheiro)
3. Funcionária confirma pagamento manualmente no painel
4. Sistema inicia o ciclo de produção

**Vantagem**: sem necessidade de integração de API de pagamento, sem taxas de processador, sem burocracia bancária.

### 7.3 Opção Avançada: Pagamento Online via M-Pesa API

A Vodacom MZ oferece a **M-Pesa API** para empresas. Requer:
- Registo como empresa na Vodacom MZ
- Contrato comercial
- Prazo de activação: 2–6 semanas

**Fluxo técnico M-Pesa:**
```
1. Backend gera referência de pagamento via API Vodacom
2. Cliente recebe USSD push no telemóvel: "Pague MT 350 à Lanchonete da Fátima?"
3. Cliente confirma com PIN do M-Pesa
4. Vodacom notifica backend via webhook (callback URL)
5. Backend marca pedido como "pago" e notifica painel da dona
```

**Endpoint de callback:**
```javascript
// Vodacom MZ notifica quando pagamento é confirmado
router.post('/webhook/mpesa', async (req, res) => {
  const { reference, amount, status } = req.body;
  
  if (status === 'SUCCESS') {
    await db.query(
      'UPDATE pedidos SET pago = true WHERE referencia_mpesa = $1',
      [reference]
    );
    // Notificar painel da dona via WebSocket
    io.emit('pedido-pago', { reference });
  }
  
  res.status(200).send('OK');
});
```

### 7.4 Comparação das Abordagens de Pagamento

| Critério | Presencial | M-Pesa API |
|---|---|---|
| Tempo para implementar | 1 dia | 4–8 semanas |
| Custo de implementação | 0 | Taxa de setup + comissão/transacção |
| Burocracia | Nenhuma | Registo empresarial Vodacom |
| Experiência cliente | Boa | Óptima (sem ir à caixa) |
| Recomendado para início | ✅ Sim | Fase 2 |

---

## 8. QR Codes por Mesa

### 8.1 Estrutura do URL

```
https://seudominio.co.mz/mesa/4?token=abc123xyz
```

O `token` é gerado uma vez por mesa e armazenado na base de dados. Serve para:
- Identificar a mesa de forma segura
- Evitar que alguém altere o número da mesa manualmente na URL

### 8.2 Geração dos QR Codes

```javascript
// Script: gerar_qr_mesas.js
const QRCode = require('qrcode');
const fs = require('fs');

const mesas = [1, 2, 3, 4, 5, 6, 7, 8];
const baseUrl = 'https://seudominio.co.mz/mesa';

mesas.forEach(async (num) => {
  const token = require('crypto').randomBytes(16).toString('hex');
  const url = `${baseUrl}/${num}?token=${token}`;
  
  await QRCode.toFile(`qr_mesa_${num}.png`, url, {
    width: 300,
    margin: 2,
    color: { dark: '#085041', light: '#FFFFFF' }
  });
  
  console.log(`Mesa ${num}: ${url}`);
  // Guardar token na base de dados
});
```

### 8.3 Impressão e Fixação

- Imprimir em papel A6 ou A5 (10×15cm)
- Plastificar para durabilidade
- Colar ou colocar em suporte de mesa
- Incluir texto: "Escaneia para fazer o pedido"
- Incluir logo da lanchonete

---

## 9. Stack Tecnológica Recomendada

### 9.1 Backend (Servidor)

**Opção A — Node.js + Express** (recomendado)
```
Node.js 20+
Express.js — framework web
PostgreSQL — base de dados
Prisma ORM — acesso à base de dados
Socket.io — tempo real (opcional)
JWT — autenticação
Africa's Talking SDK — SMS
```

**Opção B — Python + FastAPI**
```
Python 3.11+
FastAPI — framework web
PostgreSQL — base de dados
SQLAlchemy — ORM
WebSockets nativos
Africa's Talking SDK Python
```

### 9.2 Frontend (Interface Web)

**Cliente (cardápio e pedido):**
- HTML + CSS + JavaScript puro **OU** React
- PWA (Progressive Web App) — funciona offline para ver cardápio
- Optimizado para 3G: sem imagens pesadas, carregamento rápido

**Painel da Dona:**
- React com estado simples (useState)
- Actualização automática via polling ou WebSocket
- Responsive para tablet

### 9.3 Estrutura de Pastas do Projecto

```
lanchonete-digital/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── cardapio.js
│   │   │   ├── pedidos.js
│   │   │   └── painel.js
│   │   ├── services/
│   │   │   ├── sms.js
│   │   │   └── pedido.js
│   │   ├── middleware/
│   │   │   └── autenticar.js
│   │   └── db/
│   │       └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── cliente/          ← cardápio + pedido
│   └── painel/           ← gestão da dona
├── scripts/
│   └── gerar_qr.js
└── README.md
```

### 9.4 APIs Principais

```
GET  /api/cardapio              → lista produtos disponíveis
POST /api/pedidos               → criar novo pedido
GET  /api/painel/pedidos        → listar pedidos activos (autenticado)
PATCH /api/painel/pedidos/:id   → actualizar status do pedido (autenticado)
POST /api/painel/pedidos/:id/notificar  → enviar SMS ao cliente (autenticado)
POST /api/auth/login            → login da dona
```

---

## 10. Segurança

### 10.1 Autenticação

- Login da dona com **JWT (JSON Web Token)**, expiração de 8 horas
- Tokens armazenados em `httpOnly cookies` (mais seguro que localStorage)
- Refresh token para sessão longa no tablet

### 10.2 Dados do Cliente

- Número de telemóvel armazenado **apenas** se opt-in activado
- Após envio do SMS, mascarar número na base de dados: `+258 84 ***-*567`
- Nunca expor número completo na interface do painel

### 10.3 HTTPS

- Certificado SSL gratuito via Let's Encrypt
- Obrigatório para QR codes funcionarem em câmaras de telemóvel
- Railway/Render/DigitalOcean fazem isso automaticamente

### 10.4 Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

// Limitar criação de pedidos: 10 por IP por hora
const limiterPedidos = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Demasiados pedidos. Tente mais tarde.'
});

app.use('/api/pedidos', limiterPedidos);
```

---

## 11. Plano de Implementação

### Fase 1 — MVP (4–6 semanas)

| Semana | Tarefa |
|---|---|
| 1 | Configurar servidor, base de dados, domínio |
| 1–2 | Desenvolver backend: cardápio, pedidos, auth |
| 2–3 | Desenvolver frontend do cliente (cardápio + pedido) |
| 3–4 | Desenvolver painel da dona |
| 4 | Integrar Africa's Talking para SMS |
| 5 | Gerar QR codes, testes na lanchonete |
| 6 | Lançamento + formação da dona |

### Fase 2 — Melhorias (após 1–2 meses a usar)

- Integração M-Pesa API (pagamento online)
- Relatórios e estatísticas detalhadas
- Gestão de cardápio pela dona (adicionar/remover pratos)
- Múltiplas lanchonetes / filiais

### Fase 3 — Expansão

- App nativa (React Native)
- Sistema de fidelidade / descontos
- Integração com impressora de tickets (Bluetooth)

---

## 12. Estimativa de Custos

### Custos de Desenvolvimento (one-time)

| Item | Estimativa |
|---|---|
| Desenvolvimento backend | 30–60 horas de dev |
| Desenvolvimento frontend (cliente) | 20–40 horas |
| Desenvolvimento painel da dona | 20–30 horas |
| Testes e ajustes | 10–20 horas |
| **Total horas** | **80–150 horas** |

### Custos Mensais Operacionais

| Serviço | Custo estimado (USD/mês) |
|---|---|
| Servidor (Railway/Render free tier) | $0–5 |
| Base de dados PostgreSQL | $0–15 |
| Africa's Talking SMS (100 SMS/mês) | ~$2–4 |
| Domínio .co.mz (anual ÷ 12) | ~$3–5 |
| **Total mensal** | **~$5–29** |

### Custo por SMS (Africa's Talking — Moçambique)

- Aproximadamente **$0.02–0.04 USD** por SMS
- Para 500 pedidos/mês com 80% opt-in SMS: ~$8–16 USD/mês

---

## Referências e Links

- Africa's Talking: https://africastalking.com/docs/sms
- M-Pesa Moçambique (Vodacom): https://developer.vodacom.co.mz
- Railway.app (hospedagem): https://railway.app
- QRCode npm package: https://www.npmjs.com/package/qrcode
- Socket.io: https://socket.io/docs
- Express.js: https://expressjs.com
- Prisma ORM: https://www.prisma.io/docs

---

*Documento gerado em Maio 2026. Versão 1.0.*
*Sistema desenvolvido para contexto moçambicano — moeda MT, operadoras mCel/Vodacom/Movitel.*
