# 📱 Guia de Acesso Mobile

## Como Acessar do Celular

### Passo 1: Descobrir o IP do Computador

#### Windows
```bash
# Abra o CMD ou PowerShell e digite:
ipconfig

# Procure por "Endereço IPv4" na seção "Adaptador de Rede sem Fio"
# Exemplo: 192.168.1.100
```

#### Mac/Linux
```bash
# Abra o Terminal e digite:
ifconfig

# Ou use:
ip addr show

# Procure pelo IP que começa com 192.168.x.x ou 10.0.x.x
```

#### Forma Rápida (Quando iniciar o Vite)
Quando você iniciar a aplicação cliente, o Vite mostrará:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
```

Use o endereço **Network** no celular!

### Passo 2: Conectar Celular na Mesma Rede

**IMPORTANTE**: Celular e computador devem estar na **mesma rede WiFi**!

1. Abra WiFi no celular
2. Conecte na mesma rede do computador
3. Verifique se está conectado

### Passo 3: Acessar no Celular

#### Aplicação Cliente (Para clientes fazerem pedidos)
```
http://SEU_IP:5173

Exemplo:
http://192.168.1.100:5173
```

#### Painel Administrativo (Para dona da lanchonete)
```
http://SEU_IP:5174

Exemplo:
http://192.168.1.100:5174
```

### Passo 4: Testar

1. Abra o navegador do celular (Chrome, Safari, etc.)
2. Digite o endereço completo
3. Pressione Enter
4. ✅ Deve abrir a aplicação!

## Configuração Completa

### 1. Iniciar Backend
```bash
cd backend
npm run dev

# Backend rodará em: http://localhost:3000
```

### 2. Iniciar Cliente
```bash
cd frontend/cliente
npm run dev

# Cliente rodará em:
# Local:   http://localhost:5173
# Network: http://192.168.1.100:5173  ← Use este no celular!
```

### 3. Iniciar Painel
```bash
cd frontend/painel
npm run dev

# Painel rodará em:
# Local:   http://localhost:5174
# Network: http://192.168.1.100:5174  ← Use este no celular!
```

## Gerar QR Codes com IP da Rede

### Script Atualizado

O script `scripts/gerar_qr.js` agora detecta automaticamente o IP da rede:

```bash
cd scripts
node gerar_qr.js

# Opções:
# 1. Usar IP da rede (para celular)
# 2. Usar localhost (para computador)
```

### Exemplo de Uso

```bash
# Gerar QR codes para acesso mobile
node gerar_qr.js

# Escolha opção 1 (IP da rede)
# QR codes serão gerados em: qr_codes/
```

## Firewall e Segurança

### Windows Firewall

Se não conseguir acessar, pode ser o firewall:

1. **Abrir Firewall**
   - Painel de Controle → Sistema e Segurança → Firewall do Windows
   - Configurações Avançadas → Regras de Entrada
   - Nova Regra → Porta → TCP → 5173, 5174, 3000
   - Permitir conexão

2. **Forma Rápida** (Temporário)
   ```bash
   # Execute como Administrador:
   netsh advfirewall firewall add rule name="Vite Dev" dir=in action=allow protocol=TCP localport=5173,5174,3000
   ```

### Mac Firewall

1. Preferências do Sistema → Segurança e Privacidade
2. Firewall → Opções de Firewall
3. Adicione Node.js à lista de aplicativos permitidos

### Linux Firewall (UFW)

```bash
sudo ufw allow 5173/tcp
sudo ufw allow 5174/tcp
sudo ufw allow 3000/tcp
```

## Problemas Comuns

### Problema 1: Não Consegue Acessar

**Sintomas**: Celular não carrega a página

**Soluções**:
1. Verifique se está na mesma rede WiFi
2. Verifique o IP do computador
3. Teste ping do celular para o computador
4. Desative firewall temporariamente
5. Reinicie o servidor Vite

### Problema 2: Câmera Não Funciona

**Sintomas**: Scanner QR não pede permissão de câmera

**Causa**: Navegadores exigem HTTPS para câmera (exceto localhost)

**Soluções**:
1. Use HTTPS (configuração abaixo)
2. Ou use app de QR code externo para escanear

### Problema 3: API Não Funciona

**Sintomas**: Cardápio não carrega, pedidos não enviam

**Causa**: Frontend não consegue acessar backend

**Solução**: Configure proxy ou use IP completo

## Configurar HTTPS (Opcional)

Para usar câmera no celular, você precisa de HTTPS:

### Opção 1: Certificado Auto-Assinado

```bash
# Instalar mkcert
npm install -g mkcert

# Criar certificado
mkcert create-ca
mkcert create-cert

# Configurar Vite (vite.config.js)
server: {
  https: {
    key: './cert.key',
    cert: './cert.crt'
  },
  host: '0.0.0.0',
  port: 5173
}
```

### Opção 2: Ngrok (Mais Fácil)

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 5173
ngrok http 5173

# Use a URL fornecida (https://xxx.ngrok.io)
```

### Opção 3: Localtunnel

```bash
# Instalar localtunnel
npm install -g localtunnel

# Expor porta 5173
lt --port 5173

# Use a URL fornecida
```

## Teste Completo Mobile

### Checklist

1. **Preparação**
   - [ ] Computador e celular na mesma WiFi
   - [ ] Backend rodando
   - [ ] Cliente rodando
   - [ ] Painel rodando
   - [ ] IP do computador anotado

2. **Teste Cliente**
   - [ ] Abrir http://IP:5173 no celular
   - [ ] Página inicial carrega
   - [ ] Scanner QR funciona (se HTTPS)
   - [ ] Cardápio carrega
   - [ ] Adicionar produtos ao carrinho
   - [ ] Finalizar pedido

3. **Teste Painel**
   - [ ] Abrir http://IP:5174 no celular
   - [ ] Fazer login
   - [ ] Ver fila de pedidos
   - [ ] Gerar link único
   - [ ] Compartilhar via WhatsApp

## URLs de Acesso

### Desenvolvimento Local

| Aplicação | Computador | Celular (mesma rede) |
|-----------|------------|----------------------|
| Cliente | http://localhost:5173 | http://192.168.1.100:5173 |
| Painel | http://localhost:5174 | http://192.168.1.100:5174 |
| Backend | http://localhost:3000 | http://192.168.1.100:3000 |

**Nota**: Substitua `192.168.1.100` pelo seu IP real!

### Produção

| Aplicação | URL |
|-----------|-----|
| Cliente | https://seudominio.com |
| Painel | https://painel.seudominio.com |
| Backend | https://api.seudominio.com |

## Dicas de Uso Mobile

### Para Testes

1. **Use Chrome no Android**
   - Melhor suporte a PWA
   - DevTools remoto disponível
   - Melhor performance

2. **Use Safari no iOS**
   - Nativo do sistema
   - Melhor integração
   - Suporte a PWA

3. **Adicione à Tela Inicial**
   - Chrome: Menu → Adicionar à tela inicial
   - Safari: Compartilhar → Adicionar à Tela de Início
   - Funciona como app nativo!

### Para Produção

1. **Use HTTPS sempre**
   - Obrigatório para câmera
   - Obrigatório para PWA
   - Mais seguro

2. **Configure CDN**
   - Imagens mais rápidas
   - Melhor performance
   - Menor latência

3. **Otimize para 3G**
   - Comprima imagens
   - Minimize código
   - Use cache agressivo

## Debug Remoto

### Chrome DevTools (Android)

1. Conecte celular via USB
2. Ative "Depuração USB" no celular
3. Chrome no PC → chrome://inspect
4. Selecione seu dispositivo
5. Inspecione a página

### Safari DevTools (iOS)

1. iPhone: Ajustes → Safari → Avançado → Web Inspector
2. Mac: Safari → Preferências → Avançado → Mostrar menu Desenvolver
3. Conecte iPhone via USB
4. Safari no Mac → Desenvolver → [Seu iPhone]
5. Selecione a página

## Comandos Úteis

### Descobrir IP Rapidamente

```bash
# Windows
ipconfig | findstr IPv4

# Mac/Linux
ifconfig | grep "inet "

# Ou
hostname -I
```

### Testar Conexão

```bash
# Do celular, teste ping (use app de terminal)
ping 192.168.1.100

# Ou teste no navegador
http://192.168.1.100:5173
```

### Ver Logs em Tempo Real

```bash
# Backend
cd backend
npm run dev

# Cliente (outro terminal)
cd frontend/cliente
npm run dev

# Painel (outro terminal)
cd frontend/painel
npm run dev
```

## Exemplo Prático

### Cenário: Testar no Celular

```bash
# 1. Descobrir IP
ipconfig
# Resultado: 192.168.1.100

# 2. Iniciar servidores
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend/cliente && npm run dev
# Vite mostra: Network: http://192.168.1.100:5173

# Terminal 3
cd frontend/painel && npm run dev
# Vite mostra: Network: http://192.168.1.100:5174

# 3. No celular
# Abrir: http://192.168.1.100:5173
# ✅ Funciona!
```

## Segurança

### Rede Local

- ✅ Seguro para desenvolvimento
- ✅ Apenas dispositivos na mesma rede
- ✅ Não acessível da internet

### Rede Pública

- ⚠️ Não use em WiFi público
- ⚠️ Use VPN se necessário
- ⚠️ Prefira rede privada

### Produção

- ✅ Use HTTPS sempre
- ✅ Configure firewall
- ✅ Use autenticação
- ✅ Monitore acessos

## Resumo Rápido

```
1. Descubra IP: ipconfig (Windows) ou ifconfig (Mac/Linux)
2. Inicie servidores: backend + cliente + painel
3. No celular: http://SEU_IP:5173
4. Teste: Abra cardápio, faça pedido
5. Pronto! 🎉
```

**Importante**: Celular e computador na **mesma WiFi**!

---

**Última atualização**: 17 de Maio de 2026
**Versão**: 2.0.0
