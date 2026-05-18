# 🤖 Testes Automatizados - Lanchonete Digital

## 📋 Índice

1. [Testes Unitários](#testes-unitários)
2. [Testes de Integração](#testes-de-integração)
3. [Testes de Stress](#testes-de-stress)
4. [Testes E2E (End-to-End)](#testes-e2e)
5. [Testes de SMS](#testes-de-sms)

---

## 🧪 Testes Unitários

### **Instalar Dependências**

```bash
npm install --save-dev jest supertest
```

### **Configurar Jest**

Adicionar ao `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "coveragePathIgnorePatterns": ["/node_modules/"]
  }
}
```

### **Exemplo: Testar Helpers**

Criar `backend/src/utils/helpers.test.js`:

```javascript
const {
  validarTelefoneMZ,
  normalizarTelefone,
  validarFormaPagamento,
  gerarTicketNum
} = require('./helpers');

describe('Helpers - Validações', () => {
  
  describe('validarTelefoneMZ', () => {
    test('deve aceitar +258843216789', () => {
      expect(validarTelefoneMZ('+258843216789')).toBe(true);
    });
    
    test('deve aceitar 843216789', () => {
      expect(validarTelefoneMZ('843216789')).toBe(true);
    });
    
    test('deve rejeitar 123456', () => {
      expect(validarTelefoneMZ('123456')).toBe(false);
    });
    
    test('deve rejeitar +351912345678 (Portugal)', () => {
      expect(validarTelefoneMZ('+351912345678')).toBe(false);
    });
  });
  
  describe('normalizarTelefone', () => {
    test('deve normalizar 843216789 para +258843216789', () => {
      expect(normalizarTelefone('843216789')).toBe('+258843216789');
    });
    
    test('deve manter +258843216789', () => {
      expect(normalizarTelefone('+258843216789')).toBe('+258843216789');
    });
  });
  
  describe('validarFormaPagamento', () => {
    test('deve aceitar mpesa', () => {
      expect(validarFormaPagamento('mpesa')).toBe(true);
    });
    
    test('deve aceitar emola', () => {
      expect(validarFormaPagamento('emola')).toBe(true);
    });
    
    test('deve aceitar dinheiro', () => {
      expect(validarFormaPagamento('dinheiro')).toBe(true);
    });
    
    test('deve rejeitar cartao', () => {
      expect(validarFormaPagamento('cartao')).toBe(false);
    });
  });
  
  describe('gerarTicketNum', () => {
    test('deve gerar ticket com formato correto', () => {
      const ticket = gerarTicketNum();
      expect(ticket).toMatch(/^[A-Z0-9]{6}$/);
    });
    
    test('deve gerar tickets únicos', () => {
      const ticket1 = gerarTicketNum();
      const ticket2 = gerarTicketNum();
      expect(ticket1).not.toBe(ticket2);
    });
  });
});
```

### **Executar Testes**

```bash
npm test
```

---

## 🔗 Testes de Integração

### **Exemplo: Testar API de Pedidos**

Criar `backend/src/routes/pedidos.test.js`:

```javascript
const request = require('supertest');
const { app } = require('../server');

describe('API de Pedidos', () => {
  
  describe('POST /api/pedidos', () => {
    test('deve criar pedido com sucesso', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .send({
          mesaId: 1,
          itens: [
            { produtoId: 1, quantidade: 2 },
            { produtoId: 7, quantidade: 1 }
          ],
          formaPagamento: 'mpesa',
          smsOptIn: false
        });
      
      expect(response.status).toBe(201);
      expect(response.body.sucesso).toBe(true);
      expect(response.body.pedido).toHaveProperty('ticketNum');
    });
    
    test('deve rejeitar pedido sem itens', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .send({
          mesaId: 1,
          itens: [],
          formaPagamento: 'mpesa'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('erro');
    });
    
    test('deve rejeitar forma de pagamento inválida', async () => {
      const response = await request(app)
        .post('/api/pedidos')
        .send({
          mesaId: 1,
          itens: [{ produtoId: 1, quantidade: 1 }],
          formaPagamento: 'cartao'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.erro).toContain('inválida');
    });
  });
  
  describe('GET /api/pedidos/:ticketNum', () => {
    test('deve buscar pedido existente', async () => {
      // Primeiro criar um pedido
      const createResponse = await request(app)
        .post('/api/pedidos')
        .send({
          mesaId: 1,
          itens: [{ produtoId: 1, quantidade: 1 }],
          formaPagamento: 'dinheiro'
        });
      
      const ticketNum = createResponse.body.pedido.ticketNum;
      
      // Depois buscar
      const response = await request(app)
        .get(`/api/pedidos/${ticketNum}`);
      
      expect(response.status).toBe(200);
      expect(response.body.ticketNum).toBe(ticketNum);
    });
    
    test('deve retornar 404 para ticket inexistente', async () => {
      const response = await request(app)
        .get('/api/pedidos/TICKET999');
      
      expect(response.status).toBe(404);
    });
  });
});
```

---

## 💪 Testes de Stress

### **Opção 1: Artillery (Recomendado)**

#### **Instalar**

```bash
npm install -g artillery
```

#### **Criar Configuração**

Criar `artillery-config.yml`:

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramp up load"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"
  processor: "./artillery-processor.js"

scenarios:
  - name: "Fluxo Cliente Completo"
    flow:
      - get:
          url: "/api/cardapio"
      - think: 2
      - post:
          url: "/api/pedidos"
          json:
            mesaId: 1
            itens:
              - produtoId: 1
                quantidade: 2
            formaPagamento: "mpesa"
            smsOptIn: false
      - think: 1
      - get:
          url: "/api/pedidos/{{ ticketNum }}"
  
  - name: "Login e Listar Pedidos"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "admin@lanchonete.mz"
            senha: "admin123"
          capture:
            - json: "$.token"
              as: "token"
      - get:
          url: "/api/painel/pedidos"
          headers:
            Authorization: "Bearer {{ token }}"
```

#### **Executar Stress Test**

```bash
# Teste básico
artillery run artillery-config.yml

# Com relatório HTML
artillery run --output report.json artillery-config.yml
artillery report report.json
```

#### **Métricas Esperadas**

- **Latência p95:** < 500ms
- **Latência p99:** < 1000ms
- **Taxa de erro:** < 1%
- **Throughput:** > 100 req/s

---

### **Opção 2: Apache Bench (ab)**

```bash
# Instalar (Ubuntu/Debian)
sudo apt-get install apache2-utils

# Teste simples - 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:3000/api/cardapio

# Teste com POST
ab -n 100 -c 10 -p pedido.json -T application/json http://localhost:3000/api/pedidos
```

Criar `pedido.json`:

```json
{
  "mesaId": 1,
  "itens": [
    { "produtoId": 1, "quantidade": 2 }
  ],
  "formaPagamento": "mpesa"
}
```

---

### **Opção 3: k6 (Load Testing)**

#### **Instalar**

```bash
# Windows (Chocolatey)
choco install k6

# Mac
brew install k6

# Linux
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

#### **Criar Script**

Criar `k6-test.js`:

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up
    { duration: '1m', target: 50 },   // Stay at 50 users
    { duration: '30s', target: 100 }, // Spike
    { duration: '1m', target: 100 },  // Stay at 100
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das requests < 500ms
    http_req_failed: ['rate<0.01'],   // < 1% de erros
  },
};

export default function () {
  // 1. Ver cardápio
  let res = http.get('http://localhost:3000/api/cardapio');
  check(res, {
    'cardápio status 200': (r) => r.status === 200,
    'tem produtos': (r) => JSON.parse(r.body).produtos.length > 0,
  });
  
  sleep(1);
  
  // 2. Criar pedido
  const payload = JSON.stringify({
    mesaId: 1,
    itens: [
      { produtoId: 1, quantidade: 2 },
      { produtoId: 7, quantidade: 1 }
    ],
    formaPagamento: 'mpesa',
    smsOptIn: false
  });
  
  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  res = http.post('http://localhost:3000/api/pedidos', payload, params);
  check(res, {
    'pedido criado': (r) => r.status === 201,
    'tem ticket': (r) => JSON.parse(r.body).pedido.ticketNum !== undefined,
  });
  
  sleep(2);
}
```

#### **Executar**

```bash
k6 run k6-test.js
```

---

## 🌐 Testes E2E (End-to-End)

### **Playwright (Recomendado)**

#### **Instalar**

```bash
npm install --save-dev @playwright/test
npx playwright install
```

#### **Criar Teste**

Criar `tests/e2e/fluxo-completo.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Fluxo Cliente Completo', () => {
  
  test('deve fazer pedido completo', async ({ page }) => {
    // 1. Abrir página da mesa
    await page.goto('http://localhost:5173/mesa/1?token=TOKEN_AQUI');
    
    // 2. Verificar cardápio carregou
    await expect(page.locator('h1')).toContainText('Cardápio');
    
    // 3. Adicionar produto ao carrinho
    await page.click('button:has-text("Adicionar")');
    
    // 4. Ver carrinho
    await expect(page.locator('.carrinho-total')).toBeVisible();
    
    // 5. Ir para resumo
    await page.click('button:has-text("Ver Resumo")');
    
    // 6. Selecionar forma de pagamento
    await page.click('input[value="mpesa"]');
    
    // 7. Confirmar pedido
    await page.click('button:has-text("Confirmar Pedido")');
    
    // 8. Verificar confirmação
    await expect(page.locator('h1')).toContainText('Pedido Confirmado');
    await expect(page.locator('.ticket-num')).toBeVisible();
  });
});

test.describe('Fluxo Painel (Dona)', () => {
  
  test('deve gerenciar pedido', async ({ page }) => {
    // 1. Login
    await page.goto('http://localhost:5174/login');
    await page.fill('input[type="email"]', 'admin@lanchonete.mz');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // 2. Verificar redirecionamento
    await expect(page).toHaveURL('http://localhost:5174/fila');
    
    // 3. Ver pedidos
    await expect(page.locator('.pedido-card')).toBeVisible();
    
    // 4. Confirmar pedido
    await page.click('button:has-text("Confirmar")');
    
    // 5. Marcar como pronto
    await page.click('button:has-text("Pronto")');
    
    // 6. Verificar mudança de status
    await expect(page.locator('.status-pronto')).toBeVisible();
  });
});
```

#### **Executar**

```bash
npx playwright test
npx playwright test --headed  # Ver browser
npx playwright test --debug   # Debug mode
```

---

## 📱 Testes de SMS

### **Modo Sandbox (Africa's Talking)**

```javascript
// backend/src/services/sms.test.js
const { enviarSms } = require('./sms');

describe('Serviço de SMS', () => {
  
  test('deve enviar SMS em sandbox', async () => {
    const resultado = await enviarSms(
      '+258843216789',
      'Teste de SMS'
    );
    
    expect(resultado.sucesso).toBe(true);
    expect(resultado.messageId).toBeDefined();
  });
  
  test('deve rejeitar número inválido', async () => {
    const resultado = await enviarSms(
      '123456',
      'Teste'
    );
    
    expect(resultado.sucesso).toBe(false);
    expect(resultado.motivo).toContain('inválido');
  });
});
```

### **Testar Manualmente**

```bash
# Via cURL
curl -X POST http://localhost:3000/api/painel/pedidos/1/notificar \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📊 Relatório de Cobertura

```bash
# Gerar relatório
npm run test:coverage

# Abrir relatório HTML
open coverage/lcov-report/index.html
```

### **Meta de Cobertura**

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

---

## ✅ Checklist de Testes

### **Unitários**
- [ ] Validação de telefone MZ
- [ ] Normalização de telefone
- [ ] Validação de forma de pagamento
- [ ] Geração de ticket único
- [ ] Cálculo de subtotais
- [ ] Mascaramento de dados sensíveis

### **Integração**
- [ ] Criar pedido com sucesso
- [ ] Rejeitar pedido inválido
- [ ] Buscar pedido por ticket
- [ ] Login com credenciais corretas
- [ ] Rejeitar login inválido
- [ ] Listar pedidos activos
- [ ] Actualizar status do pedido
- [ ] Enviar SMS

### **Stress**
- [ ] 100 requests/segundo
- [ ] 1000 usuários simultâneos
- [ ] Latência p95 < 500ms
- [ ] Taxa de erro < 1%
- [ ] Sem memory leaks

### **E2E**
- [ ] Fluxo cliente completo
- [ ] Fluxo painel completo
- [ ] Tempo real (Socket.io)
- [ ] Offline (PWA)
- [ ] Responsividade mobile

---

## 🚀 CI/CD (Opcional)

### **GitHub Actions**

Criar `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📞 Suporte

Se encontrar problemas nos testes:

1. Verifique se o servidor está rodando
2. Verifique se a base de dados está conectada
3. Limpe cache: `npm cache clean --force`
4. Reinstale dependências: `rm -rf node_modules && npm install`

---

**Tempo estimado:** 30-45 minutos para configurar todos os testes ⏱️
