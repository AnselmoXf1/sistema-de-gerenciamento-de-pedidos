# 🚀 Guia de Instalação - Lanchonete Digital

Este guia vai te ajudar a configurar e rodar o projeto completo.

## 📋 Pré-requisitos

Antes de começar, certifica-te que tens instalado:

- **Node.js 20+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

Para verificar se estão instalados:
```bash
node --version
npm --version
psql --version
```

## 🔧 Passo 1: Clonar o Projeto

```bash
# Se estás a usar Git
git clone <url-do-repositorio>
cd lanchonete-digital

# Ou se já tens a pasta, apenas entra nela
cd lanchonete-digital
```

## 📦 Passo 2: Instalar Dependências

### Backend
```bash
# Na raiz do projeto
npm install
```

### Frontend - Cliente
```bash
cd frontend/cliente
npm install
cd ../..
```

## 🗄️ Passo 3: Configurar Base de Dados

### 3.1 Criar Base de Dados PostgreSQL

```bash
# Entrar no PostgreSQL
psql -U postgres

# Criar base de dados
CREATE DATABASE lanchonete_db;

# Criar usuário (opcional)
CREATE USER lanchonete_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE lanchonete_db TO lanchonete_user;

# Sair
\q
```

### 3.2 Configurar Variáveis de Ambiente

```bash
# Copiar ficheiro de exemplo
cp .env.example .env

# Editar o .env com os teus dados
# Windows: notepad .env
# Linux/Mac: nano .env
```

Edita o `.env` e preenche:
```env
DATABASE_URL="postgresql://postgres:tua_senha@localhost:5432/lanchonete_db?schema=public"
JWT_SECRET="gera_uma_string_aleatoria_aqui_123456789"
```

### 3.3 Executar Migrações

```bash
# Criar tabelas na base de dados
npm run db:migrate
```

### 3.4 Popular com Dados de Exemplo

```bash
# Adicionar produtos, mesas e usuário admin
npm run db:seed
```

Após o seed, vais ver:
- **Email:** admin@lanchonete.mz
- **Senha:** admin123
- URLs das mesas para testar

## 🎯 Passo 4: Rodar o Projeto

### Opção A: Rodar Tudo Separadamente (Recomendado para desenvolvimento)

**Terminal 1 - Backend:**
```bash
npm run dev
```
Servidor vai rodar em: `http://localhost:3000`

**Terminal 2 - Frontend Cliente:**
```bash
cd frontend/cliente
npm run dev
```
Cliente vai rodar em: `http://localhost:5173`

### Opção B: Testar Backend Apenas

```bash
npm run dev
```

Acede: `http://localhost:3000` para ver a API

## 🧪 Passo 5: Testar o Sistema

### 5.1 Testar API Backend

Abre o browser em: `http://localhost:3000`

Deves ver:
```json
{
  "message": "🍔 Lanchonete Digital API",
  "version": "1.0.0"
}
```

### 5.2 Testar Cardápio

Acede: `http://localhost:3000/api/cardapio`

Deves ver a lista de produtos.

### 5.3 Testar Interface do Cliente

1. Gera os QR codes:
```bash
npm run gerar:qr
```

2. Abre o ficheiro gerado: `qr_codes/imprimir_todos.html`

3. Ou acede directamente a uma mesa:
```
http://localhost:5173/mesa/1?token=<token_da_mesa>
```

(O token está na base de dados ou nos logs do seed)

## 📱 Passo 6: Configurar SMS (Opcional)

### 6.1 Criar Conta Africa's Talking

1. Acede: https://africastalking.com
2. Cria conta (teste grátis disponível)
3. Vai em "Settings" → "API Key"
4. Copia o API Key e Username

### 6.2 Configurar no .env

```env
AT_API_KEY=teu_api_key_aqui
AT_USERNAME=teu_username
AT_SENDER_ID=LanchFatima
```

### 6.3 Testar SMS

No painel da dona, ao marcar pedido como "Pronto", o SMS será enviado automaticamente.

## 🔍 Passo 7: Abrir Painel da Dona

1. Acede: `http://localhost:3000/painel` (ou cria interface React)
2. Login:
   - Email: `admin@lanchonete.mz`
   - Senha: `admin123`

## 🐛 Resolução de Problemas

### Erro: "Cannot connect to database"

**Solução:**
- Verifica se PostgreSQL está a rodar
- Confirma as credenciais no `.env`
- Testa conexão: `psql -U postgres -d lanchonete_db`

### Erro: "Port 3000 already in use"

**Solução:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero_do_pid> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

Ou muda a porta no `.env`:
```env
PORT=3001
```

### Erro: "Prisma Client not generated"

**Solução:**
```bash
npx prisma generate
```

### Erro: "Module not found"

**Solução:**
```bash
# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

## 📊 Passo 8: Ver Base de Dados (Opcional)

```bash
# Abrir Prisma Studio - interface visual
npm run db:studio
```

Abre automaticamente em: `http://localhost:5555`

## 🎨 Passo 9: Personalizar

### Mudar Nome da Lanchonete

Edita os ficheiros:
- `frontend/cliente/src/pages/Cardapio.jsx` - linha do título
- `backend/src/services/sms.js` - mensagens SMS
- `scripts/gerar_qr.js` - nome nos QR codes

### Adicionar Produtos

1. Acede Prisma Studio: `npm run db:studio`
2. Vai em "produtos"
3. Clica "Add record"
4. Preenche os dados

Ou edita: `backend/src/db/seed.js` e executa novamente.

## 🚀 Próximos Passos

Agora que está tudo a funcionar:

1. ✅ Testa fazer um pedido completo
2. ✅ Testa o painel da dona
3. ✅ Imprime os QR codes
4. ✅ Configura SMS (se quiseres)
5. ✅ Personaliza o design
6. ✅ Faz deploy (ver README.md)

## 📞 Suporte

Se tiveres problemas:
1. Verifica os logs no terminal
2. Consulta a documentação: `documentacao_sistema_pedidos_mz.md`
3. Verifica se todos os serviços estão a rodar

## ✅ Checklist Final

- [ ] PostgreSQL instalado e a rodar
- [ ] Node.js instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Base de dados criada
- [ ] Migrações executadas (`npm run db:migrate`)
- [ ] Seed executado (`npm run db:seed`)
- [ ] Backend a rodar (`npm run dev`)
- [ ] Frontend a rodar (`cd frontend/cliente && npm run dev`)
- [ ] Consegues aceder ao cardápio
- [ ] Consegues fazer um pedido de teste
- [ ] QR codes gerados (`npm run gerar:qr`)

---

**Parabéns! 🎉 O sistema está pronto para usar!**

Para deploy em produção, consulta o README.md principal.
