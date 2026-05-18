# 🧪 Guia de Testes de Campo - Lanchonete Digital

## 📋 Checklist Completo de Testes

### ✅ Pré-requisitos

- [ ] Backend rodando e conectado à base de dados
- [ ] Frontend Cliente rodando
- [ ] Frontend Painel rodando
- [ ] QR codes gerados e impressos
- [ ] 3+ telemóveis da equipa disponíveis
- [ ] Conexão 3G/4G disponível para testes
- [ ] SMS configurado (ou modo mock)

---

## 📱 Passo 1: Gerar e Imprimir QR Codes

### **1.1 Gerar QR Codes**

```bash
# Na raiz do projeto
npm run gerar:qr
```

**Resultado:**
- Ficheiros salvos em: `qr_codes/`
- Ficheiro HTML para impressão: `qr_codes/imprimir_todos.html`

### **1.2 Imprimir QR Codes**

1. Abra: `qr_codes/imprimir_todos.html` no browser
2. Pressione `Ctrl+P` (Windows) ou `Cmd+P` (Mac)
3. Configurações de impressão:
   - **Tamanho:** A4
   - **Orientação:** Retrato
   - **Margens:** Normais
   - **Cor:** Preto e branco (economiza tinta)
4. Imprima **10 páginas** (1 por mesa)

### **1.3 Preparar QR Codes**

**Opção 1: Plastificar (Recomendado)**
- Leve a uma papelaria
- Plastifique cada QR code
- **Custo:** ~50-100 MT por unidade
- **Vantagem:** Durável, resistente à água

**Opção 2: Proteger com Fita Adesiva**
- Cole fita adesiva transparente sobre o QR
- **Custo:** ~10 MT por unidade
- **Vantagem:** Barato, rápido

**Opção 3: Porta-Cartões**
- Coloque em porta-cartões de plástico
- **Custo:** ~30 MT por unidade
- **Vantagem:** Fácil de trocar

### **1.4 Colar nas Mesas**

1. Limpe a superfície da mesa
2. Cole o QR code em local visível
3. Posição recomendada:
   - **Centro da mesa** (mais visível)
   - **Canto superior direito** (não atrapalha)
4. Use fita dupla-face forte
5. Teste escanear com telemóvel

---

## 🧪 Passo 2: Testes com Equipa (10+ Pedidos)

### **2.1 Preparação**

**Equipa necessária:**
- 3-5 pessoas com telemóveis
- 1 pessoa no painel (dona/funcionária)
- Conexão 3G/4G (desligar WiFi!)

**Telemóveis:**
- Android: Chrome, Firefox
- iOS: Safari, Chrome
- Diferentes operadoras (Vodacom, mCel, Movitel)

### **2.2 Cenários de Teste**

#### **Teste 1: Pedido Simples (3 pessoas)**

**Pessoa 1:**
1. Escanear QR da Mesa 1
2. Adicionar: 1 Hambúrguer + 1 Coca-Cola
3. Forma de pagamento: M-Pesa
4. SMS: Não
5. Confirmar pedido
6. ⏱️ **Tempo esperado:** < 10 segundos

**Pessoa 2:**
1. Escanear QR da Mesa 2
2. Adicionar: 2 Cachorros Quentes + 2 Fantas
3. Forma de pagamento: Dinheiro
4. SMS: Sim (+258XXXXXXXXX)
5. Confirmar pedido
6. ⏱️ **Tempo esperado:** < 10 segundos

**Pessoa 3:**
1. Escanear QR da Mesa 3
2. Adicionar: 1 Frango + 1 Batata + 1 Água
3. Forma de pagamento: e-Mola
4. SMS: Sim (+258XXXXXXXXX)
5. Observações: "Sem pimenta"
6. Confirmar pedido
7. ⏱️ **Tempo esperado:** < 10 segundos

**Painel (Dona):**
1. Ver 3 pedidos chegarem em tempo real
2. ⏱️ **Tempo esperado:** < 2 segundos após confirmação
3. Ouvir alerta sonoro
4. Ver badge de contador

#### **Teste 2: Fluxo Completo (1 pedido)**

**Cliente:**
1. Escanear QR
2. Fazer pedido com SMS opt-in
3. Anotar número do ticket
4. Ir para página "Acompanhar Pedido"
5. Ver status: "Aguardando"

**Painel:**
1. Ver pedido chegar
2. Clicar "Confirmar" → Status: "Em Preparo"
3. Cliente vê mudança em tempo real
4. Clicar "Pronto" → Status: "Pronto"
5. SMS enviado automaticamente
6. ⏱️ **SMS deve chegar em < 30 segundos**
7. Clicar "Entregue" → Status: "Entregue"

**Verificar:**
- [ ] Status actualiza em tempo real no cliente
- [ ] SMS recebido no telemóvel
- [ ] Tempo total < 2 minutos

#### **Teste 3: Múltiplos Pedidos Simultâneos (5 pessoas)**

**Todas as pessoas ao mesmo tempo:**
1. Escanear QR de mesas diferentes (1-5)
2. Fazer pedidos diferentes
3. Confirmar todos em intervalo de 10 segundos

**Painel:**
1. Ver todos os pedidos chegarem
2. Verificar ordem (mais antigo primeiro)
3. Processar um por um

**Verificar:**
- [ ] Todos os pedidos chegam
- [ ] Ordem correta
- [ ] Sem perda de dados
- [ ] Sem travamentos

#### **Teste 4: Conexão 3G Lenta**

**Configuração:**
1. Desligar WiFi
2. Usar apenas dados móveis 3G
3. Se possível, ir para área com sinal fraco

**Cliente:**
1. Escanear QR
2. Aguardar carregamento do cardápio
3. ⏱️ **Tempo esperado:** < 5 segundos (3G)
4. Fazer pedido
5. ⏱️ **Tempo esperado:** < 10 segundos

**Verificar:**
- [ ] Página carrega mesmo em 3G
- [ ] Imagens carregam (ou placeholder)
- [ ] Pedido é criado com sucesso
- [ ] Loading spinner aparece

#### **Teste 5: Offline (PWA)**

**Cliente:**
1. Abrir site com WiFi
2. Navegar pelo cardápio
3. Desligar WiFi/dados
4. Tentar navegar
5. Ver banner "Sem conexão"
6. Ligar WiFi/dados novamente
7. Fazer pedido

**Verificar:**
- [ ] Banner offline aparece
- [ ] Página offline.html carrega
- [ ] Reconecta automaticamente
- [ ] Pedido funciona após reconexão

#### **Teste 6: QR Code Inválido**

**Cliente:**
1. Tentar acessar URL com token errado
2. Ver mensagem de erro
3. Não conseguir fazer pedido

**Verificar:**
- [ ] Erro claro: "Mesa não encontrada"
- [ ] Não trava a aplicação

#### **Teste 7: Carrinho Vazio**

**Cliente:**
1. Escanear QR
2. Clicar "Ver Resumo" sem adicionar produtos
3. Ver mensagem de erro

**Verificar:**
- [ ] Erro: "Carrinho vazio"
- [ ] Botão desabilitado

#### **Teste 8: Telefone Inválido**

**Cliente:**
1. Fazer pedido
2. Marcar SMS opt-in
3. Digite telefone inválido: "123456"
4. Tentar confirmar

**Verificar:**
- [ ] Erro: "Telefone inválido"
- [ ] Formato sugerido: +258XXXXXXXXX

#### **Teste 9: Histórico e Relatórios**

**Painel:**
1. Processar 10+ pedidos
2. Ir para "Histórico"
3. Ver todos os pedidos do dia
4. Filtrar por status: "Entregue"
5. Ir para "Relatórios"
6. Ver totais do dia

**Verificar:**
- [ ] Todos os pedidos aparecem
- [ ] Filtros funcionam
- [ ] Totais corretos (MT)
- [ ] Gráficos/estatísticas

#### **Teste 10: Stress Test (10 pedidos em 1 minuto)**

**Equipa:**
1. 5 pessoas com 2 telemóveis cada
2. Fazer 10 pedidos em 1 minuto
3. Todos confirmam ao mesmo tempo

**Painel:**
1. Ver todos chegarem
2. Processar rapidamente

**Verificar:**
- [ ] Servidor não trava
- [ ] Todos os pedidos salvos
- [ ] Tempo real funciona
- [ ] Sem erros no console

---

## 📊 Passo 3: Métricas de Performance

### **Tempos Esperados**

| Ação | Tempo Esperado | Tempo Máximo |
|------|----------------|--------------|
| Carregar cardápio (WiFi) | < 2s | 3s |
| Carregar cardápio (3G) | < 5s | 8s |
| Criar pedido | < 3s | 5s |
| Actualizar status | < 1s | 2s |
| Enviar SMS | < 30s | 60s |
| Tempo real (Socket.io) | < 1s | 2s |

### **Taxa de Sucesso**

- **Pedidos criados:** > 99%
- **SMS entregues:** > 95%
- **Tempo real:** > 98%
- **Erros:** < 1%

---

## 📝 Passo 4: Formulário de Teste

### **Para cada teste, preencher:**

```
📋 TESTE #___

Data: ___/___/2026
Hora: ___:___
Testador: _______________
Telemóvel: _______________
Operadora: _______________
Conexão: WiFi / 3G / 4G

CENÁRIO: _______________

PASSOS:
1. _______________
2. _______________
3. _______________

RESULTADO:
✅ Sucesso / ❌ Falhou

TEMPO: ___ segundos

OBSERVAÇÕES:
_______________
_______________

BUGS ENCONTRADOS:
_______________
_______________
```

---

## 🐛 Passo 5: Reportar Bugs

### **Template de Bug Report**

```
🐛 BUG #___

TÍTULO: _______________

SEVERIDADE: 🔴 Crítico / 🟡 Médio / 🟢 Baixo

DESCRIÇÃO:
_______________

PASSOS PARA REPRODUZIR:
1. _______________
2. _______________
3. _______________

RESULTADO ESPERADO:
_______________

RESULTADO ACTUAL:
_______________

TELEMÓVEL: _______________
BROWSER: _______________
CONEXÃO: _______________

SCREENSHOT: (se possível)
```

---

## ✅ Checklist Final de Testes de Campo

### **Infraestrutura**
- [ ] QR codes gerados (10 mesas)
- [ ] QR codes impressos
- [ ] QR codes plastificados/protegidos
- [ ] QR codes colados nas mesas
- [ ] Todos os QR codes escaneiam corretamente

### **Testes Funcionais**
- [ ] 10+ pedidos reais criados
- [ ] Todos os status testados (aguardando → entregue)
- [ ] SMS recebidos (< 30s)
- [ ] Tempo real funciona
- [ ] Histórico correto
- [ ] Relatórios corretos

### **Testes de Performance**
- [ ] Carregamento < 3s (WiFi)
- [ ] Carregamento < 8s (3G)
- [ ] Múltiplos pedidos simultâneos
- [ ] Sem travamentos
- [ ] Sem perda de dados

### **Testes de Usabilidade**
- [ ] Interface intuitiva
- [ ] Botões grandes (fácil clicar)
- [ ] Texto legível
- [ ] Cores contrastantes
- [ ] Feedback visual claro

### **Testes de Erro**
- [ ] QR inválido → erro claro
- [ ] Carrinho vazio → erro claro
- [ ] Telefone inválido → erro claro
- [ ] Sem conexão → banner offline
- [ ] Servidor offline → mensagem de erro

### **Testes de Segurança**
- [ ] Login requer senha
- [ ] Token JWT expira
- [ ] Dados sensíveis mascarados
- [ ] Rate limiting funciona

---

## 📞 Passo 6: Feedback da Equipa

### **Perguntas para a Equipa**

**Para Clientes (Testadores):**
1. Foi fácil escanear o QR code?
2. O cardápio carregou rápido?
3. Foi fácil adicionar produtos?
4. O processo de pagamento foi claro?
5. Recebeu o SMS a tempo?
6. O que melhoraria?

**Para Dona/Funcionária (Painel):**
1. Foi fácil ver os pedidos?
2. Os alertas sonoros ajudaram?
3. Foi fácil mudar o status?
4. O histórico é útil?
5. Os relatórios são claros?
6. O que melhoraria?

---

## 🎯 Critérios de Aprovação

Para considerar o sistema **pronto para produção**:

✅ **Obrigatório:**
- [ ] 100% dos QR codes funcionam
- [ ] 95%+ dos pedidos criados com sucesso
- [ ] 90%+ dos SMS entregues (< 30s)
- [ ] 0 bugs críticos
- [ ] Tempo real funciona em 98%+ dos casos
- [ ] Carregamento < 8s em 3G

✅ **Desejável:**
- [ ] 0 bugs médios
- [ ] Feedback positivo da equipa
- [ ] Carregamento < 5s em 3G
- [ ] Interface intuitiva (sem treinamento)

---

## 🚀 Próximos Passos

Depois dos testes de campo:

1. **Corrigir bugs** encontrados
2. **Implementar melhorias** sugeridas
3. **Fazer testes finais** (1-2 dias)
4. **Treinar equipa** (30 minutos)
5. **Lançar para clientes reais** 🎉

---

**Tempo estimado de testes:** 2-3 horas ⏱️

**Equipa necessária:** 5-7 pessoas 👥

**Equipamento:** 5+ telemóveis 📱
