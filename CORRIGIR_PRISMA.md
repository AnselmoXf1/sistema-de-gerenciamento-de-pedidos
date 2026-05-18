# 🔧 Corrigir Erro do Prisma

## ❌ Problema
Instalou Prisma 7 que tem sintaxe diferente.

## ✅ Solução Rápida (2 minutos)

### Passo 1: Remover Prisma 7
```bash
# Remover node_modules e package-lock
rm -rf node_modules package-lock.json

# Ou no Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json
```

### Passo 2: Reinstalar com Versão Correta
```bash
# Instalar Prisma 5.9.1 (versão compatível)
npm install

# Gerar Prisma Client
npx prisma generate
```

### Passo 3: Criar Tabelas
```bash
# Agora vai funcionar!
npx prisma db push
```

### Passo 4: Popular Dados
```bash
npm run db:seed
```

### Passo 5: Rodar
```bash
npm run dev
```

---

## 🎯 Comando Único (Copy & Paste)

### Windows PowerShell:
```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json; npm install; npx prisma generate; npx prisma db push; npm run db:seed; npm run dev
```

### Windows CMD:
```cmd
rmdir /s /q node_modules & del package-lock.json & npm install & npx prisma generate & npx prisma db push & npm run db:seed & npm run dev
```

### Mac/Linux:
```bash
rm -rf node_modules package-lock.json && npm install && npx prisma generate && npx prisma db push && npm run db:seed && npm run dev
```

---

## ✅ Verificar Versão

```bash
# Deve mostrar: 5.9.1
npx prisma --version
```

---

## 🎉 Pronto!

Depois destes comandos, o servidor vai rodar sem erros! 🚀
