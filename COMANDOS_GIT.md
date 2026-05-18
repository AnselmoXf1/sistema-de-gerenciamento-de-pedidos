# 📝 Comandos Git - Passo a Passo

## Situação Atual

Você está na pasta `frontend` mas precisa fazer commit da **raiz do projeto**.

## ✅ Comandos Corretos

### 1. Voltar para a Raiz do Projeto

```bash
cd ..
# Agora você deve estar em: C:\Users\Anselmo D.Bistiro\Desktop\saas
```

### 2. Verificar Status

```bash
git status
```

### 3. Adicionar Todos os Arquivos

```bash
git add .
```

### 4. Fazer Commit

```bash
git commit -m "feat: Sistema completo - Scanner QR, Links Únicos e Deploy configs"
```

### 5. Adicionar Remote (se ainda não fez)

```bash
git remote add origin https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos.git
```

**Se der erro "remote origin already exists":**
```bash
git remote set-url origin https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos.git
```

### 6. Fazer Push

```bash
git push -u origin main
```

**OU (se der erro):**
```bash
git push --set-upstream origin main
```

## 🔄 Sequência Completa

Copie e cole estes comandos um por um:

```bash
# 1. Voltar para raiz
cd C:\Users\Anselmo D.Bistiro\Desktop\saas

# 2. Verificar se está na pasta certa
dir
# Deve ver: backend, frontend, scripts, etc.

# 3. Inicializar git (se ainda não fez)
git init

# 4. Adicionar todos os arquivos
git add .

# 5. Fazer commit
git commit -m "feat: Sistema completo com todas funcionalidades"

# 6. Adicionar remote
git remote add origin https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos.git

# 7. Fazer push
git push -u origin main
```

## ⚠️ Se Der Erro "remote origin already exists"

```bash
# Remover remote existente
git remote remove origin

# Adicionar novamente
git remote add origin https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos.git

# Fazer push
git push -u origin main
```

## ⚠️ Se Der Erro "failed to push some refs"

Isso significa que o repositório remoto tem commits que você não tem localmente.

**Opção 1: Forçar push (CUIDADO: sobrescreve tudo no GitHub)**
```bash
git push -u origin main --force
```

**Opção 2: Fazer pull primeiro (recomendado)**
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

## ⚠️ Se Der Erro de Autenticação

GitHub não aceita mais senha. Use Personal Access Token:

### Criar Token:
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Selecione: `repo` (todos os checkboxes)
5. Generate token
6. **Copie o token** (só aparece uma vez!)

### Usar Token:
```bash
# Quando pedir senha, cole o token
git push -u origin main
# Username: AnselmoXf1
# Password: [Cole o token aqui]
```

### Salvar Credenciais:
```bash
git config --global credential.helper store
git push -u origin main
# Digite token uma vez, será salvo
```

## 📁 Estrutura Esperada no GitHub

Após push bem-sucedido, seu repositório deve ter:

```
sistema-de-gerenciamento-de-pedidos/
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── cliente/
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── netlify.toml
│   └── painel/
│       ├── src/
│       ├── package.json
│       └── netlify.toml
├── scripts/
├── database/
├── qr_codes/
├── .gitignore
├── render.yaml
├── package.json
└── README.md
```

## ✅ Verificar Push

Após push, verifique no GitHub:

1. Abra: https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos
2. Deve ver todos os arquivos
3. Deve ver o commit recente

## 🚀 Próximo Passo: Deploy

Após push bem-sucedido:

1. **Deploy Backend no Render**
   - Siga: `DEPLOY_RAPIDO.md`
   - Seção 2

2. **Deploy Frontends no Netlify**
   - Siga: `DEPLOY_RAPIDO.md`
   - Seções 3 e 4

## 📝 Comandos Úteis

### Ver Histórico
```bash
git log --oneline
```

### Ver Remote
```bash
git remote -v
```

### Ver Branch Atual
```bash
git branch
```

### Ver Status
```bash
git status
```

### Ver Diferenças
```bash
git diff
```

## 🔧 Resolver Problemas Comuns

### Problema: "fatal: not a git repository"

**Solução:**
```bash
cd C:\Users\Anselmo D.Bistiro\Desktop\saas
git init
```

### Problema: "nothing to commit"

**Solução:**
```bash
git add .
git status
# Deve mostrar arquivos em verde
```

### Problema: "large files"

**Solução:**
```bash
# Remover node_modules do git
git rm -r --cached node_modules
git rm -r --cached frontend/cliente/node_modules
git rm -r --cached frontend/painel/node_modules
git rm -r --cached backend/node_modules

# Adicionar ao .gitignore
echo "node_modules/" >> .gitignore

# Commit
git add .
git commit -m "Remove node_modules"
git push
```

### Problema: "Permission denied"

**Solução:**
```bash
# Usar HTTPS em vez de SSH
git remote set-url origin https://github.com/AnselmoXf1/sistema-de-gerenciamento-de-pedidos.git
```

## 📋 Checklist Final

Antes de fazer deploy:

- [ ] Está na pasta raiz do projeto
- [ ] `git status` mostra arquivos corretos
- [ ] `.gitignore` está configurado
- [ ] `node_modules/` não está sendo commitado
- [ ] Commit feito com sucesso
- [ ] Push feito com sucesso
- [ ] Arquivos visíveis no GitHub

## 🎯 Resumo Ultra-Rápido

```bash
cd C:\Users\Anselmo D.Bistiro\Desktop\saas
git add .
git commit -m "Sistema completo"
git push -u origin main
```

Se der erro, use `--force`:
```bash
git push -u origin main --force
```

---

**Próximo passo**: Após push bem-sucedido, siga `DEPLOY_RAPIDO.md`
