# 🎨 Guia para Criar Ícones - Lanchonete Digital

## 📋 Ícones Necessários

O projeto precisa de ícones PWA nos seguintes tamanhos:
- **192x192 pixels** (ícone padrão)
- **512x512 pixels** (ícone de alta resolução)

## 🎨 Design Recomendado

### Conceito
- Logo da lanchonete (ex: hambúrguer estilizado)
- Cores: Verde (#085041) e branco
- Estilo: Simples, moderno, reconhecível

### Especificações Técnicas
- **Formato:** PNG com fundo transparente
- **Tamanho:** 192x192px e 512x512px
- **Cores:** Usar paleta do projeto
- **Padding:** 10-15% de margem interna
- **Estilo:** Flat design, sem sombras complexas

## 🛠️ Ferramentas para Criar

### Opção 1: Canva (Fácil)
1. Acede: https://www.canva.com
2. Cria design personalizado 512x512px
3. Usa elementos gratuitos (hambúrguer, prato, etc)
4. Exporta como PNG
5. Redimensiona para 192x192px

### Opção 2: Figma (Profissional)
1. Acede: https://www.figma.com
2. Cria frame 512x512px
3. Desenha o ícone
4. Exporta como PNG @1x e @2x

### Opção 3: Gerador Online
1. Acede: https://realfavicongenerator.net/
2. Faz upload de uma imagem
3. Gera todos os tamanhos automaticamente
4. Download do pacote completo

### Opção 4: DALL-E / Midjourney (IA)
Prompt sugerido:
```
"Simple flat icon of a hamburger for a restaurant app, 
green and white colors, minimalist design, 
transparent background, 512x512 pixels"
```

## 📁 Onde Colocar os Ícones

Depois de criar, substitui os placeholders:

```
frontend/cliente/public/icon-192.png
frontend/cliente/public/icon-512.png
```

## ✅ Checklist de Qualidade

- [ ] Ícone visível em fundo claro e escuro
- [ ] Reconhecível em tamanho pequeno (48x48px)
- [ ] Sem texto (apenas símbolo)
- [ ] Cores consistentes com o brand
- [ ] PNG com transparência
- [ ] Tamanhos corretos (192x192 e 512x512)

## 🎨 Exemplo de Código SVG Simples

Se quiseres criar um ícone SVG simples:

```svg
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Fundo circular verde -->
  <circle cx="256" cy="256" r="240" fill="#085041"/>
  
  <!-- Hambúrguer simplificado (branco) -->
  <rect x="156" y="200" width="200" height="20" rx="10" fill="white"/>
  <rect x="156" y="240" width="200" height="40" rx="10" fill="white"/>
  <rect x="156" y="300" width="200" height="20" rx="10" fill="white"/>
</svg>
```

Salva como `icon.svg` e converte para PNG usando:
- https://cloudconvert.com/svg-to-png
- Ou Inkscape (software gratuito)

## 🚀 Solução Rápida (Temporária)

Se precisas de algo rápido para testar:

1. Usa um emoji grande:
   - 🍔 (hambúrguer)
   - 🍽️ (prato)
   - 🍴 (talheres)

2. Captura screenshot em 512x512px

3. Usa ferramenta online para converter:
   - https://favicon.io/emoji-favicons/

## 📝 Depois de Criar

1. Substitui os ficheiros:
```bash
# Copia os novos ícones
cp teu-icon-192.png frontend/cliente/public/icon-192.png
cp teu-icon-512.png frontend/cliente/public/icon-512.png
```

2. Testa o PWA:
```bash
cd frontend/cliente
npm run build
npm run preview
```

3. Verifica no Chrome DevTools:
   - Lighthouse > Progressive Web App
   - Deve mostrar os ícones correctos

## 🎯 Resultado Final

Quando bem feito, o ícone vai aparecer:
- ✅ No ecrã inicial do telemóvel (quando instalado)
- ✅ Na barra de tarefas
- ✅ No splash screen ao abrir
- ✅ Nas notificações

---

**Dica:** Investe tempo num bom ícone! É a primeira impressão do teu app. 🎨
