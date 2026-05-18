# 🧪 Guia de Testes - Links Únicos

## Teste Rápido (5 minutos)

### 1. Iniciar Aplicações

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Cliente
cd frontend/cliente
npm run dev

# Terminal 3 - Painel
cd frontend/painel
npm run dev
```

### 2. Testar Gerador de Links

1. **Acessar Painel**
   ```
   http://localhost:5174
   ```

2. **Fazer Login**
   - Usuário: `admin`
   - Senha: `admin123`

3. **Gerar Link**
   - Clique em "🔗 Gerar Link" no menu
   - Selecione tipo: "Delivery"
   - Clique em "Gerar Link Único"
   - ✅ Deve aparecer QR code e link

4. **Copiar Link**
   - Clique em "📋 Copiar"
   - ✅ Deve mostrar "✓ Copiado!"

5. **Baixar QR Code**
   - Clique em "⬇️ Baixar QR"
   - ✅ Deve baixar imagem PNG

### 3. Testar Link Gerado

1. **Abrir Link**
   - Cole o link copiado no navegador
   - ✅ Deve abrir cardápio com badge "🛵 Delivery"

2. **Fazer Pedido**
   - Adicione produtos ao carrinho
   - Clique em "Ver Carrinho"
   - Preencha dados
   - Finalize pedido
   - ✅ Deve criar pedido com sucesso

3. **Verificar na Fila**
   - Volte ao painel
   - Clique em "📋 Fila"
   - ✅ Pedido deve aparecer com "Mesa: Delivery"

### 4. Testar Scanner QR

1. **Acessar Cliente**
   ```
   http://localhost:5173
   ```

2. **Iniciar Scanner**
   - Clique em "📷 Escanear QR Code"
   - ✅ Deve solicitar permissão de câmera

3. **Permitir Câmera**
   - Clique em "Permitir" no navegador
   - ✅ Scanner deve iniciar

4. **Escanear QR Code**
   - Mostre QR code baixado para câmera
   - ✅ Deve detectar e redirecionar automaticamente

## Testes Detalhados

### Teste 1: Tipos de Link

**Objetivo**: Verificar todos os tipos de link

**Passos**:
1. Gere link tipo "Delivery"
2. Abra o link
3. ✅ Verifique badge "🛵 Delivery"
4. ✅ Verifique texto "Entregaremos no seu endereço"

5. Gere link tipo "Takeaway"
6. Abra o link
7. ✅ Verifique badge "🥡 Takeaway"
8. ✅ Verifique texto "Levante no balcão"

9. Gere link tipo "Mesa Virtual"
10. Abra o link
11. ✅ Verifique badge "🪑 Mesa Virtual"

### Teste 2: Validade do Link

**Objetivo**: Verificar configuração de validade

**Passos**:
1. Gere link com validade "1 hora"
2. ✅ Verifique texto "Válido por 1 hora(s)"

3. Gere link com validade "Sem validade"
4. ✅ Verifique texto "Este link não expira"

### Teste 3: Descrição Personalizada

**Objetivo**: Verificar descrição opcional

**Passos**:
1. Gere link com descrição "Teste Promoção"
2. ✅ Verifique que descrição aparece no resultado

### Teste 4: Compartilhamento WhatsApp

**Objetivo**: Verificar integração WhatsApp

**Passos**:
1. Gere um link
2. Clique em "💬 WhatsApp"
3. ✅ Deve abrir WhatsApp Web/App
4. ✅ Mensagem deve conter o link

### Teste 5: Scanner - Permissão Negada

**Objetivo**: Verificar tratamento de erro

**Passos**:
1. Acesse cliente
2. Clique em "Escanear QR Code"
3. Negue permissão de câmera
4. ✅ Deve mostrar mensagem de erro
5. ✅ Deve mostrar instruções
6. ✅ Deve ter botão "Permitir Acesso"

### Teste 6: Scanner - QR Code Inválido

**Objetivo**: Verificar validação de QR code

**Passos**:
1. Inicie scanner
2. Escaneie QR code aleatório (não do sistema)
3. ✅ Deve mostrar erro "QR code inválido"
4. ✅ Scanner deve continuar ativo

### Teste 7: Pedido via Link

**Objetivo**: Fluxo completo de pedido

**Passos**:
1. Gere link tipo "Delivery"
2. Abra link em nova aba anônima
3. Adicione 2 produtos ao carrinho
4. Vá para resumo
5. Preencha:
   - Nome: "Cliente Teste"
   - Telefone: "845551234"
   - Forma pagamento: "M-Pesa"
6. Finalize pedido
7. ✅ Deve mostrar confirmação
8. ✅ Deve ter número de ticket
9. Volte ao painel
10. ✅ Pedido deve estar na fila
11. ✅ Mesa deve ser "Delivery"

### Teste 8: Múltiplos Links

**Objetivo**: Verificar links independentes

**Passos**:
1. Gere 3 links diferentes
2. Abra cada um em aba diferente
3. ✅ Todos devem funcionar
4. ✅ Cada um deve ter ID único
5. Faça pedido em cada um
6. ✅ Todos devem aparecer na fila

### Teste 9: Responsividade

**Objetivo**: Verificar em diferentes dispositivos

**Passos Desktop**:
1. Abra em tela cheia
2. ✅ Layout deve estar organizado
3. ✅ QR code deve estar centralizado

**Passos Mobile**:
1. Abra DevTools (F12)
2. Ative modo mobile
3. ✅ Layout deve adaptar
4. ✅ Botões devem ser touch-friendly
5. ✅ QR code deve ser visível

### Teste 10: Performance

**Objetivo**: Verificar velocidade

**Passos**:
1. Gere um link
2. ✅ Deve gerar em menos de 1 segundo
3. Abra o link gerado
4. ✅ Deve carregar em menos de 2 segundos
5. Inicie scanner
6. ✅ Câmera deve iniciar em menos de 3 segundos

## Checklist de Testes

### Funcionalidades Básicas
- [ ] Gerar link Delivery
- [ ] Gerar link Takeaway
- [ ] Gerar link Mesa Virtual
- [ ] Copiar link
- [ ] Baixar QR code
- [ ] Compartilhar WhatsApp
- [ ] Abrir link gerado
- [ ] Fazer pedido via link

### Scanner QR
- [ ] Solicitar permissão câmera
- [ ] Iniciar scanner
- [ ] Detectar QR code válido
- [ ] Rejeitar QR code inválido
- [ ] Redirecionar após scan
- [ ] Cancelar scanner
- [ ] Tratamento de erro

### Interface
- [ ] Layout responsivo
- [ ] Animações suaves
- [ ] Feedback visual
- [ ] Mensagens de erro claras
- [ ] Ícones descritivos
- [ ] Cores consistentes

### Integração
- [ ] Pedido aparece na fila
- [ ] Status correto
- [ ] Mesa identificada corretamente
- [ ] Socket.io funcionando
- [ ] Notificações funcionando

## Problemas Conhecidos

### Câmera não funciona em HTTP
**Problema**: Navegadores modernos exigem HTTPS para câmera

**Solução**: 
- Em desenvolvimento, use `localhost` (funciona)
- Em produção, use HTTPS obrigatoriamente

### QR Code não carrega
**Problema**: API externa pode estar lenta

**Solução**:
- Aguarde alguns segundos
- Recarregue a página
- Verifique conexão com internet

### Scanner não detecta
**Problema**: QR code muito pequeno ou desfocado

**Solução**:
- Aumente tamanho do QR code
- Melhore iluminação
- Aproxime/afaste câmera

## Relatório de Bugs

Se encontrar bugs, documente:

```markdown
### Bug: [Título]

**Descrição**: [O que aconteceu]

**Passos para reproduzir**:
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Resultado esperado**: [O que deveria acontecer]

**Resultado atual**: [O que aconteceu]

**Ambiente**:
- Navegador: [Chrome/Firefox/Safari]
- Versão: [Versão do navegador]
- Sistema: [Windows/Mac/Linux/Android/iOS]
- Tela: [Desktop/Mobile]

**Screenshots**: [Se possível]
```

## Testes Automatizados (Futuro)

### Planejado para v2.1.0
- [ ] Testes unitários dos componentes
- [ ] Testes de integração
- [ ] Testes E2E com Cypress
- [ ] Testes de performance
- [ ] Testes de acessibilidade

## Conclusão

Após completar todos os testes:

✅ **Tudo funcionando**: Sistema pronto para uso
⚠️ **Alguns problemas**: Revisar e corrigir
❌ **Muitos problemas**: Investigar e refatorar

---

**Tempo estimado de testes**: 30-45 minutos
**Última atualização**: 17 de Maio de 2026
