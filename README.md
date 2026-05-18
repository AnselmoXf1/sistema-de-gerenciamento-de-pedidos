# 🍔 Lanchonete Digital - Sistema de Gestão de Pedidos

Sistema web de auto-serviço para lanchonetes em Moçambique. Cliente escaneia QR code, faz pedido, paga (M-Pesa/e-Mola/dinheiro) e recebe SMS quando o pedido estiver pronto.

## 🎯 Funcionalidades

### Para o Cliente
- ✅ Escaneia QR code da mesa
- ✅ Visualiza cardápio digital
- ✅ Faz pedido sem fila
- ✅ Escolhe forma de pagamento (M-Pesa, e-Mola, dinheiro)
- ✅ Recebe SMS quando pedido estiver pronto (opcional)

### Para a Dona/Funcionária
- ✅ Painel de gestão em tempo real
- ✅ Fila de pedidos com estados
- ✅ Notificação sonora de novos pedidos
- ✅ Envio de SMS automático/manual
- ✅ Histórico e relatórios do dia
- ✅ Gestão de cardápio

## 🛠️ Stack Tecnológica

**Backend:**
- Node.js + Express
- PostgreSQL + Prisma ORM
- Socket.io (tempo real)
- JWT (autenticação)
- Africa's Talking (SMS)

**Frontend:**
- React (cliente e painel)
- PWA (Progressive Web App)
- Socket.io Client

## 🚀 Instalação e Configuração

### 1. Pré-requisitos
```bash
# Instalar Node.js 20+
node --version

# Instalar PostgreSQL
# Windows: https://www.postgresql.org/download/windows/
# Ou usar Railway/Render para PostgreSQL na nuvem
```

### 2. Clonar e Instalar
```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edita o .env com os teus dados
```

### 3. Configurar Base de Dados
```bash
# Criar base de dados e tabelas
npm run db:migrate

# Popular com dados de exemplo
npm run db:seed

# Abrir interface visual da BD (opcional)
npm run db:studio
```

### 4. Rodar o Servidor
```bash
# Modo desenvolvimento (auto-reload)
npm run dev

# Modo produção
npm start
```

O servidor vai rodar em: `http://localhost:3000`

### 5. Gerar QR Codes das Mesas
```bash
npm run gerar:qr
```

Os QR codes serão salvos em `qr_codes/`

## 📁 Estrutura do Projeto

```
lanchonete-digital/
│
├── backend/
│   ├── src/
│   │   ├── routes/          # Rotas da API
│   │   │   ├── cardapio.js
│   │   │   ├── pedidos.js
│   │   │   ├── painel.js
│   │   │   └── auth.js
│   │   ├── services/        # Lógica de negócio
│   │   │   ├── sms.js
│   │   │   ├── pedido.js
│   │   │   └── pagamento.js
│   │   ├── middleware/      # Middlewares
│   │   │   ├── auth.js
│   │   │   └── rateLimit.js
│   │   ├── config/          # Configurações
│   │   │   ├── database.js
│   │   │   └── socket.js
│   │   ├── utils/           # Utilitários
│   │   │   └── helpers.js
│   │   └── server.js        # Entrada principal
│   │
│   └── prisma/
│       └── schema.prisma    # Schema da base de dados
│
├── frontend/
│   ├── cliente/             # Interface do cliente
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── App.jsx
│   │   └── package.json
│   │
│   └── painel/              # Painel da dona
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── App.jsx
│       └── package.json
│
├── scripts/
│   ├── gerar_qr.js          # Gera QR codes das mesas
│   └── backup_db.js         # Backup da base de dados
│
├── qr_codes/                # QR codes gerados
│
├── .env                     # Variáveis de ambiente (não commitar!)
├── .env.example             # Exemplo de configuração
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Públicos (sem autenticação)
```
GET  /api/cardapio              # Lista produtos disponíveis
POST /api/pedidos               # Criar novo pedido
GET  /api/mesa/:id              # Validar mesa pelo token
```

### Autenticados (painel da dona)
```
POST  /api/auth/login           # Login
GET   /api/painel/pedidos       # Listar pedidos activos
PATCH /api/painel/pedidos/:id   # Actualizar status do pedido
POST  /api/painel/pedidos/:id/notificar  # Enviar SMS
GET   /api/painel/historico     # Histórico de pedidos
GET   /api/painel/relatorios    # Relatórios do dia
```

## 📱 Configurar Africa's Talking (SMS)

1. Criar conta em: https://africastalking.com
2. Adicionar créditos (teste grátis disponível)
3. Obter API Key e Username
4. Configurar no `.env`:
```env
AT_API_KEY=seu_api_key
AT_USERNAME=seu_username
AT_SENDER_ID=LanchFatima
```

## 💳 Configurar Pagamentos (Fase 2)

### M-Pesa (Vodacom MZ)
1. Registar empresa na Vodacom
2. Solicitar acesso à API
3. Configurar webhook para callbacks

### e-Mola (mCel)
1. Contactar mCel para integração comercial
2. Obter credenciais de API

**Nota:** Para MVP, usar pagamento presencial (cliente paga na caixa)

## 🧪 Testar Localmente

### 1. Expor servidor local com ngrok
```bash
# Instalar ngrok: https://ngrok.com/download
ngrok http 3000
```

### 2. Testar QR codes
- Imprimir QR code de teste
- Escanear com telemóvel
- Fazer pedido de teste

### 3. Testar painel
- Aceder: `http://localhost:3000/painel`
- Login: `admin@lanchonete.mz` / `senha123`

## 🚀 Deploy em Produção

### Opção 1: Railway.app (Recomendado)
```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login e deploy
railway login
railway init
railway up
```

### Opção 2: Render.com
1. Conectar repositório GitHub
2. Configurar variáveis de ambiente
3. Deploy automático

### Opção 3: DigitalOcean
- Droplet Ubuntu 22.04
- Nginx como reverse proxy
- PM2 para gestão de processos
- Certbot para SSL

## 📊 Monitorização

- Logs do servidor: `logs/app.log`
- Logs de SMS: painel Africa's Talking
- Métricas: integrar com Sentry (opcional)

## 🔒 Segurança

- ✅ HTTPS obrigatório (Let's Encrypt)
- ✅ JWT com expiração
- ✅ Rate limiting em endpoints públicos
- ✅ Helmet.js para headers de segurança
- ✅ Validação de inputs
- ✅ Números de telemóvel mascarados após uso

## 📈 Roadmap

### Fase 1 - MVP (Actual)
- [x] Estrutura do projeto
- [ ] Backend completo
- [ ] Interface do cliente
- [ ] Painel da dona
- [ ] Integração SMS
- [ ] QR codes

### Fase 2 - Melhorias
- [ ] Pagamento online M-Pesa
- [ ] Relatórios avançados
- [ ] Gestão de cardápio pela dona
- [ ] Impressora de tickets

### Fase 3 - Expansão
- [ ] App nativa (React Native)
- [ ] Sistema de fidelidade
- [ ] Múltiplas filiais
- [ ] Dashboard analytics

## 💰 Custos Estimados

| Item | Custo/mês |
|------|-----------|
| Servidor (Railway free tier) | $0-5 |
| PostgreSQL | $0-15 |
| SMS (100 msgs) | $2-4 |
| Domínio .co.mz | ~$3-5 |
| **Total** | **$5-29** |

## 🆘 Suporte

- Documentação completa: `documentacao_sistema_pedidos_mz.md`
- Issues: criar issue no repositório
- Email: suporte@lanchonete.mz

## 📝 Licença

MIT License - Livre para usar e modificar

---

**Desenvolvido para o contexto moçambicano** 🇲🇿  
Moeda: MT (Meticais) | Operadoras: Vodacom, mCel, Movitel
