# ✅ Checklist de Implementação - Lanchonete Digital

## 🔐 Autenticação

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Endpoint POST /api/auth/login (JWT) | ✅ | `backend/src/routes/auth.js` | Login com email/senha |
| Middleware de autenticação para rotas protegidas | ✅ | `backend/src/middleware/auth.js` | JWT verification |
| Hash de senha com bcrypt | ✅ | `backend/src/routes/auth.js` | bcryptjs usado |
| Endpoint POST /api/auth/registar | ✅ | `backend/src/routes/auth.js` | Apenas dev mode |
| Verificação de role (dona/funcionaria) | ✅ | `backend/src/middleware/auth.js` | Função verificarRole |

## 🍔 Cardápio e Mesas

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| GET /api/cardapio — listar produtos disponíveis | ✅ | `backend/src/routes/cardapio.js` | Público |
| GET /api/cardapio/:id — buscar produto específico | ✅ | `backend/src/routes/cardapio.js` | Público |
| GET /api/pedidos/mesa/:id/validar — validar token do QR | ✅ | `backend/src/routes/pedidos.js` | Valida mesa + token |
| PATCH /api/produtos/:id — activar/desactivar produto | ⚠️ | **FALTA CRIAR** | Para dona gerir cardápio |
| POST /api/produtos — adicionar produto | ⚠️ | **FALTA CRIAR** | Para dona adicionar |
| DELETE /api/produtos/:id — remover produto | ⚠️ | **FALTA CRIAR** | Para dona remover |

## 📋 Pedidos

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| POST /api/pedidos — criar pedido | ✅ | `backend/src/routes/pedidos.js` | Com itens e pagamento |
| GET /api/pedidos/:ticketNum — buscar pedido | ✅ | `backend/src/routes/pedidos.js` | Público |
| GET /api/painel/pedidos — listar pedidos activos | ✅ | `backend/src/routes/painel.js` | Autenticado |
| PATCH /api/painel/pedidos/:id — mudar status | ✅ | `backend/src/routes/painel.js` | Autenticado |
| GET /api/painel/historico — pedidos do dia | ✅ | `backend/src/routes/painel.js` | Com filtros |
| GET /api/painel/relatorios/dia — relatório | ✅ | `backend/src/routes/painel.js` | Facturação total |

## 📱 SMS e Notificações

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Instalar SDK Africa's Talking | ✅ | `package.json` | africastalking@^0.6.3 |
| Configurar credenciais AT | ✅ | `.env.example` | AT_API_KEY, AT_USERNAME |
| Função enviarSms | ✅ | `backend/src/services/sms.js` | Com logs |
| POST /api/painel/pedidos/:id/notificar — SMS manual | ✅ | `backend/src/routes/painel.js` | Rate limited |
| Envio automático ao marcar "Pronto" | ✅ | `backend/src/routes/painel.js` | Auto trigger |
| Função notificarPedidoPronto | ✅ | `backend/src/services/sms.js` | Verifica opt-in |
| Função notificarPedidoRecebido | ✅ | `backend/src/services/sms.js` | Opcional |
| Log de SMS na base de dados | ✅ | `backend/prisma/schema.prisma` | Tabela LogSms |
| Validação de telefone MZ | ✅ | `backend/src/utils/helpers.js` | Formato +258 |
| Máscara de telefone | ✅ | `backend/src/utils/helpers.js` | Privacidade |

## 🔌 Tempo Real (Socket.io)

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Configurar Socket.io no servidor | ✅ | `backend/src/server.js` | Com CORS |
| Evento 'novo-pedido' | ✅ | `backend/src/routes/pedidos.js` | Emite ao criar |
| Evento 'pedido-actualizado' | ✅ | `backend/src/routes/painel.js` | Emite ao actualizar |
| Sala 'painel' para dona | ✅ | `backend/src/server.js` | socket.join('painel') |

## 🗄️ Base de Dados

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Schema Prisma completo | ✅ | `backend/prisma/schema.prisma` | 6 tabelas |
| Tabela mesas | ✅ | Schema | Com qrToken |
| Tabela produtos | ✅ | Schema | Cardápio |
| Tabela pedidos | ✅ | Schema | Com status |
| Tabela itens_pedido | ✅ | Schema | Relação N:N |
| Tabela usuarios | ✅ | Schema | Dona/funcionária |
| Tabela log_sms | ✅ | Schema | Auditoria |
| Script de seed | ✅ | `backend/src/db/seed.js` | Dados iniciais |
| Migrações | ✅ | Comando `npm run db:migrate` | Prisma migrate |

## 🛡️ Segurança

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Helmet.js para headers | ✅ | `backend/src/server.js` | Segurança HTTP |
| Rate limiting login | ✅ | `backend/src/middleware/rateLimit.js` | 5/15min |
| Rate limiting pedidos | ✅ | `backend/src/middleware/rateLimit.js` | 10/hora |
| Rate limiting SMS | ✅ | `backend/src/middleware/rateLimit.js` | 3/min |
| CORS configurado | ✅ | `backend/src/server.js` | Permite frontend |
| Validação de inputs | ✅ | Todas as rotas | Checks manuais |
| HTTPS (produção) | ⚠️ | **DEPLOY** | Let's Encrypt |

## 🎨 Frontend Cliente

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Página Cardápio | ✅ | `frontend/cliente/src/pages/Cardapio.jsx` | Com filtros |
| Componente ProdutoCard | ✅ | `frontend/cliente/src/components/ProdutoCard.jsx` | Add/remove |
| Context Carrinho | ✅ | `frontend/cliente/src/context/CarrinhoContext.jsx` | Estado global |
| Página Resumo | ✅ | `frontend/cliente/src/pages/Resumo.jsx` | Checkout |
| Página Confirmação | ✅ | `frontend/cliente/src/pages/Confirmacao.jsx` | Ticket |
| Página Acompanhar | ✅ | `frontend/cliente/src/pages/AcompanharPedido.jsx` | Status |
| Cliente API (axios) | ✅ | `frontend/cliente/src/services/api.js` | HTTP client |
| Estilos responsivos | ✅ | `frontend/cliente/src/styles/*.css` | Mobile-first |
| PWA config | ⚠️ | **FALTA** | manifest.json |

## 🖥️ Frontend Painel (Dona)

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Página Login | ⚠️ | **FALTA CRIAR** | Autenticação |
| Página Fila de Pedidos | ⚠️ | **FALTA CRIAR** | Tempo real |
| Componente Card Pedido | ⚠️ | **FALTA CRIAR** | Com acções |
| Socket.io client | ⚠️ | **FALTA CRIAR** | Eventos tempo real |
| Página Histórico | ⚠️ | **FALTA CRIAR** | Filtros |
| Página Relatórios | ⚠️ | **FALTA CRIAR** | Gráficos |
| Notificação sonora | ⚠️ | **FALTA CRIAR** | Novo pedido |
| Gestão de Cardápio | ⚠️ | **FALTA CRIAR** | CRUD produtos |

## 🛠️ Utilitários

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Script gerar QR codes | ✅ | `scripts/gerar_qr.js` | Com HTML |
| Helpers (validações) | ✅ | `backend/src/utils/helpers.js` | 10+ funções |
| Geração de ticket único | ✅ | `backend/src/utils/helpers.js` | P-XXX |
| Formatação MT | ✅ | `backend/src/utils/helpers.js` | Moeda |
| Normalização telefone | ✅ | `backend/src/utils/helpers.js` | +258 |

## 📚 Documentação

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| README principal | ✅ | `README.md` | Visão geral |
| Guia de instalação | ✅ | `GUIA_INSTALACAO.md` | Passo a passo |
| Documentação técnica | ✅ | `documentacao_sistema_pedidos_mz.md` | Completa |
| Documentação API | ✅ | `API_DOCUMENTATION.md` | Endpoints |
| Estrutura do projeto | ✅ | `ESTRUTURA_PROJETO.md` | Ficheiros |
| Este checklist | ✅ | `CHECKLIST_IMPLEMENTACAO.md` | Status |
| Colecção Postman | ⚠️ | **FALTA** | Ficheiro .json |
| Swagger/OpenAPI | ⚠️ | **FALTA** | Spec YAML |

## 🧪 Testes

| Tarefa | Status | Ficheiro | Notas |
|--------|--------|----------|-------|
| Testes unitários backend | ❌ | **FALTA** | Jest |
| Testes integração API | ❌ | **FALTA** | Supertest |
| Testes frontend | ❌ | **FALTA** | Vitest |
| Testes E2E | ❌ | **FALTA** | Playwright |

## 🚀 Deploy

| Tarefa | Status | Notas |
|--------|--------|-------|
| Deploy backend Railway | ⚠️ | Pronto para deploy |
| Deploy frontend Vercel | ⚠️ | Pronto para deploy |
| Configurar PostgreSQL produção | ⚠️ | Railway/Render |
| Configurar variáveis ambiente | ⚠️ | No serviço |
| Domínio .co.mz | ⚠️ | Registar |
| SSL/HTTPS | ⚠️ | Automático |
| Monitorização | ⚠️ | Sentry (opcional) |

---

## 📊 Resumo

### ✅ Completo (Backend Core)
- Autenticação JWT
- API de cardápio
- API de pedidos
- API do painel
- Integração SMS
- Base de dados completa
- Socket.io tempo real
- Rate limiting
- Segurança básica
- Frontend cliente completo
- Scripts utilitários
- Documentação completa

### ⚠️ Falta Implementar (Prioridade Média)
- Gestão de produtos pela dona (CRUD)
- Frontend do painel da dona
- PWA config (manifest.json)
- Colecção Postman exportada

### ❌ Falta Implementar (Prioridade Baixa)
- Testes automatizados
- Swagger/OpenAPI spec
- Pagamento online M-Pesa
- Impressora de tickets
- App nativa

---

## 🎯 Próximos Passos Recomendados

### Fase 1 - MVP Funcional (1-2 semanas)
1. ✅ Backend API completo
2. ✅ Frontend cliente completo
3. ⚠️ **Criar frontend painel da dona** (PRIORIDADE)
4. ⚠️ Adicionar CRUD de produtos
5. ⚠️ Testar SMS em sandbox Africa's Talking
6. ⚠️ Deploy em Railway/Render

### Fase 2 - Melhorias (2-4 semanas)
1. Adicionar testes
2. PWA completo
3. Relatórios avançados
4. Notificações push
5. Integração M-Pesa

### Fase 3 - Expansão (1-2 meses)
1. App nativa React Native
2. Sistema de fidelidade
3. Múltiplas filiais
4. Analytics dashboard

---

## 📝 Notas

- **Backend:** 95% completo ✅
- **Frontend Cliente:** 100% completo ✅
- **Frontend Painel:** 0% completo ⚠️
- **Documentação:** 100% completa ✅
- **Testes:** 0% completo ❌
- **Deploy:** Pronto mas não executado ⚠️

**Última actualização:** 16 de Maio de 2026
