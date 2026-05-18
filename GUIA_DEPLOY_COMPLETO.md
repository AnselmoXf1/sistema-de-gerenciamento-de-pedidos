# 🚀 Guia Completo de Deploy

## Arquitetura de Deploy

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUÇÃO                              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend Cliente (Netlify)                             │
│  https://lanchonete-cliente.netlify.app                 │
│  ↓                                                       │
│  Frontend Painel (Netlify)                              │
│  https://lanchonete-painel.netlify.app                  │
│  ↓                                                       │
│  Backend API (Render)                                   │
│  https://lanchonete-api.onrender.com                    │
│  ↓                                                       │
│  PostgreSQL Database (Render)                           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Pré-requisitos

- [x] Conta no GitHub
- [x] Conta no Netlify (gratuita)
- [x] Conta no Render (gratuita)
- [x] Código no repositório GitHub

## Parte 1: Preparar Repositório GitHub

### 1.1 Inicializar Git (se ainda não fez)

```bash
git init
git add .
git commit -m "Initial commit - Sistema de Pedidos"
```

### 1.2 Conectar ao Repositório Remoto

```bash
git remote add origin https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos.git
git branch -M main
git push -u origin main
```

### 1.3 Verificar Arquivos Importantes

Certifique-se que estes arquivos existem:

```
✅ .gitignore
✅ frontend/cliente/netlify.toml
✅ frontend/painel/netlify.toml
✅ render.yaml
✅ backend/package.json
✅ frontend/cliente/package.json
✅ frontend/painel/package.json
```

## Parte 2: Deploy do Backend no Render

### 2.1 Criar Conta no Render

1. Acesse: https://render.com
2. Clique em "Get Started"
3. Faça login com GitHub

### 2.2 Criar Banco de Dados PostgreSQL

1. No Dashboard do Render, clique em "New +"
2. Selecione "PostgreSQL"
3. Configure:
   - **Name**: `lanchonete-db`
   - **Database**: `lanchonete`
   - **User**: `lanchonete_user`
   - **Region**: Oregon (US West)
   - **Plan**: Free
4. Clique em "Create Database"
5. **IMPORTANTE**: Copie a "Internal Database URL" (vamos usar depois)

### 2.3 Criar Web Service (Backend)

1. No Dashboard, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório GitHub
4. Configure:

**Basic:**
- **Name**: `lanchonete-api`
- **Region**: Oregon (US West)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command**: `npm start`

**Advanced:**
- **Plan**: Free
- **Auto-Deploy**: Yes

**Environment Variables:**
```
NODE_ENV = production
PORT = 3000
DATABASE_URL = [Cole a Internal Database URL do passo 2.2]
JWT_SECRET = [Gere uma string aleatória segura]
BASE_URL = https://lanchonete-cliente.netlify.app
AFRICASTALKING_USERNAME = [Seu username]
AFRICASTALKING_API_KEY = [Sua API key]
```

5. Clique em "Create Web Service"
6. Aguarde o deploy (5-10 minutos)
7. **IMPORTANTE**: Copie a URL do serviço (ex: `https://lanchonete-api.onrender.com`)

### 2.4 Executar Seed do Banco

Após o deploy, execute o seed:

1. No Render Dashboard, vá em seu serviço
2. Clique em "Shell" (no menu lateral)
3. Execute:
```bash
npm run db:seed
```

## Parte 3: Deploy do Frontend Cliente no Netlify

### 3.1 Criar Conta no Netlify

1. Acesse: https://netlify.com
2. Clique em "Sign up"
3. Faça login com GitHub

### 3.2 Criar Novo Site

1. No Dashboard, clique em "Add new site"
2. Selecione "Import an existing project"
3. Escolha "Deploy with GitHub"
4. Autorize o Netlify a acessar seu repositório
5. Selecione o repositório: `sistema-de-gerenciamento-de-pedidos`

### 3.3 Configurar Build (Cliente)

**Build settings:**
- **Base directory**: `frontend/cliente`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/cliente/dist`
- **Branch**: `main`

**Environment variables:**
```
VITE_API_URL = https://lanchonete-api.onrender.com
```

### 3.4 Deploy

1. Clique em "Deploy site"
2. Aguarde o build (2-5 minutos)
3. **IMPORTANTE**: Copie a URL do site (ex: `https://random-name-123.netlify.app`)

### 3.5 Configurar Domínio Personalizado (Opcional)

1. Vá em "Site settings" → "Domain management"
2. Clique em "Options" → "Edit site name"
3. Mude para: `lanchonete-cliente`
4. URL final: `https://lanchonete-cliente.netlify.app`

## Parte 4: Deploy do Frontend Painel no Netlify

### 4.1 Criar Novo Site

Repita o processo do Parte 3, mas com estas diferenças:

**Build settings:**
- **Base directory**: `frontend/painel`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/painel/dist`

**Environment variables:**
```
VITE_API_URL = https://lanchonete-api.onrender.com
```

**Site name:**
- `lanchonete-painel`
- URL final: `https://lanchonete-painel.netlify.app`

## Parte 5: Atualizar Variáveis de Ambiente

### 5.1 Atualizar Backend (Render)

Volte ao Render e atualize a variável `BASE_URL`:

```
BASE_URL = https://lanchonete-cliente.netlify.app
```

Clique em "Save Changes" (vai fazer redeploy automático)

### 5.2 Atualizar CORS no Backend

Edite `backend/src/server.js` localmente:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://lanchonete-cliente.netlify.app',
    'https://lanchonete-painel.netlify.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
```

Commit e push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

## Parte 6: Testar em Produção

### 6.1 Testar Backend

```bash
curl https://lanchonete-api.onrender.com/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": ...
}
```

### 6.2 Testar Cliente

1. Abra: `https://lanchonete-cliente.netlify.app`
2. Deve carregar a página inicial
3. Clique em "Digitar Código da Mesa"
4. Digite: `1`
5. Deve carregar o cardápio

### 6.3 Testar Painel

1. Abra: `https://lanchonete-painel.netlify.app`
2. Faça login:
   - Usuário: `admin`
   - Senha: `admin123`
3. Deve ver a fila de pedidos

### 6.4 Testar Scanner QR no Mobile

1. Abra no celular: `https://lanchonete-cliente.netlify.app`
2. Clique em "Escanear QR Code"
3. **Agora deve funcionar!** (HTTPS ativado)
4. Permita acesso à câmera
5. Escaneie um QR code

## Parte 7: Gerar QR Codes para Produção

### 7.1 Atualizar Script

Edite `scripts/gerar_qr.js` e adicione opção para URL de produção:

```javascript
// Adicione esta opção no menu
console.log('4. URL de produção (Netlify)');
console.log('   URL: https://lanchonete-cliente.netlify.app');

// No switch case
else if (resposta === '4') {
  resolve('https://lanchonete-cliente.netlify.app');
}
```

### 7.2 Gerar QR Codes

```bash
npm run gerar:qr
# Escolha opção 4 (produção)
```

### 7.3 Imprimir QR Codes

1. Abra: `qr_codes/imprimir_todos.html`
2. Imprima ou salve como PDF
3. Coloque nas mesas

## Parte 8: Configurações Adicionais

### 8.1 Configurar Domínio Próprio (Opcional)

**No Netlify:**
1. Compre um domínio (ex: `lanchonete-fatima.com`)
2. No Netlify: Site settings → Domain management
3. Add custom domain
4. Configure DNS conforme instruções

**Resultado:**
- Cliente: `https://lanchonete-fatima.com`
- Painel: `https://painel.lanchonete-fatima.com`

### 8.2 Configurar SSL (Automático)

Netlify e Render já fornecem SSL gratuito via Let's Encrypt.
Não precisa fazer nada!

### 8.3 Configurar Notificações SMS

No Render, adicione as variáveis:

```
AFRICASTALKING_USERNAME = seu_username
AFRICASTALKING_API_KEY = sua_api_key
```

## Parte 9: Monitoramento

### 9.1 Logs do Backend (Render)

1. Dashboard → Seu serviço
2. Clique em "Logs"
3. Veja logs em tempo real

### 9.2 Analytics do Frontend (Netlify)

1. Dashboard → Seu site
2. Clique em "Analytics"
3. Veja visitantes, pageviews, etc.

### 9.3 Uptime Monitoring

**Render:**
- Plano Free: Serviço "dorme" após 15 min de inatividade
- Primeira requisição após "acordar" demora ~30s
- Solução: Upgrade para plano pago ($7/mês)

**Alternativa:**
Use um serviço de ping gratuito:
- UptimeRobot: https://uptimerobot.com
- Configure para fazer ping a cada 5 minutos

## Parte 10: Manutenção

### 10.1 Atualizar Código

```bash
# Fazer mudanças localmente
git add .
git commit -m "Descrição das mudanças"
git push

# Deploy automático acontece em:
# - Netlify: ~2 minutos
# - Render: ~5 minutos
```

### 10.2 Rollback (Voltar Versão)

**Netlify:**
1. Site → Deploys
2. Encontre deploy anterior
3. Clique em "Publish deploy"

**Render:**
1. Dashboard → Serviço
2. Events → Deploy anterior
3. Clique em "Redeploy"

### 10.3 Backup do Banco

**Render (Manual):**
1. Dashboard → Database
2. Clique em "Backups"
3. Create backup

**Automático:**
- Plano Free: Sem backups automáticos
- Plano Pago: Backups diários

## Checklist de Deploy

### Pré-Deploy
- [ ] Código commitado no GitHub
- [ ] Variáveis de ambiente configuradas
- [ ] Arquivos de configuração criados
- [ ] Testado localmente

### Backend (Render)
- [ ] Banco de dados criado
- [ ] Web service criado
- [ ] Variáveis de ambiente configuradas
- [ ] Migrations executadas
- [ ] Seed executado
- [ ] Health check funcionando

### Frontend Cliente (Netlify)
- [ ] Site criado
- [ ] Build configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Site acessível

### Frontend Painel (Netlify)
- [ ] Site criado
- [ ] Build configurado
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Login funcionando

### Testes
- [ ] Backend responde
- [ ] Cliente carrega cardápio
- [ ] Painel faz login
- [ ] Pedido é criado
- [ ] Pedido aparece na fila
- [ ] Scanner QR funciona no mobile
- [ ] Links únicos funcionam

## URLs Finais

Após deploy completo, você terá:

```
Cliente:  https://lanchonete-cliente.netlify.app
Painel:   https://lanchonete-painel.netlify.app
Backend:  https://lanchonete-api.onrender.com
```

## Custos

### Plano Free (Atual)

| Serviço | Custo | Limitações |
|---------|-------|------------|
| Netlify | $0 | 100GB bandwidth/mês |
| Render (Web) | $0 | Dorme após 15min inativo |
| Render (DB) | $0 | 1GB storage, sem backups |
| **Total** | **$0/mês** | Adequado para testes |

### Plano Recomendado (Produção)

| Serviço | Custo | Benefícios |
|---------|-------|------------|
| Netlify | $0 | Suficiente |
| Render (Web) | $7/mês | Sempre ativo, SSL |
| Render (DB) | $7/mês | 10GB, backups diários |
| **Total** | **$14/mês** | Produção real |

## Problemas Comuns

### Build falha no Netlify

**Erro**: `Command failed with exit code 1`

**Solução**:
1. Verifique logs do build
2. Teste build localmente: `npm run build`
3. Verifique variáveis de ambiente

### Backend não conecta ao banco

**Erro**: `Can't reach database server`

**Solução**:
1. Verifique `DATABASE_URL` no Render
2. Use "Internal Database URL" (não External)
3. Aguarde banco estar "Available"

### CORS error no frontend

**Erro**: `Access to fetch blocked by CORS policy`

**Solução**:
1. Adicione URLs do Netlify no CORS do backend
2. Redeploy do backend
3. Limpe cache do navegador

### Scanner não funciona

**Erro**: `Camera access only supported in secure contexts`

**Solução**:
- Certifique-se que está usando HTTPS (Netlify fornece)
- Não funciona em HTTP (exceto localhost)

## Suporte

### Documentação Oficial
- Netlify: https://docs.netlify.com
- Render: https://render.com/docs
- Prisma: https://www.prisma.io/docs

### Comunidade
- Netlify Community: https://answers.netlify.com
- Render Community: https://community.render.com

---

**Última atualização**: 17 de Maio de 2026
**Versão**: 2.0.0
**Status**: ✅ Pronto para deploy!
