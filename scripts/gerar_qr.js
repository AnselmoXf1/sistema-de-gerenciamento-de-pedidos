const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Função para obter IP da rede local
function obterIPLocal() {
  const interfaces = os.networkInterfaces();
  
  for (const nome in interfaces) {
    for (const iface of interfaces[nome]) {
      // Pular endereços internos e não IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

// Função para perguntar ao usuário
async function perguntarTipoURL() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const ipLocal = obterIPLocal();
  
  return new Promise((resolve) => {
    console.log('\n📱 Como você vai acessar a aplicação?\n');
    console.log('1. Do celular (mesma rede WiFi)');
    console.log(`   URL: http://${ipLocal}:5173`);
    console.log('\n2. Do computador (localhost)');
    console.log('   URL: http://localhost:5173');
    console.log('\n3. URL personalizada');
    console.log('   Digite sua URL\n');
    
    rl.question('Escolha uma opção (1, 2 ou 3): ', (resposta) => {
      rl.close();
      
      if (resposta === '1') {
        resolve(`http://${ipLocal}:5173`);
      } else if (resposta === '2') {
        resolve('http://localhost:5173');
      } else if (resposta === '3') {
        const rl2 = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        rl2.question('Digite a URL completa: ', (url) => {
          rl2.close();
          resolve(url);
        });
      } else {
        console.log('⚠️  Opção inválida. Usando IP local...');
        resolve(`http://${ipLocal}:5173`);
      }
    });
  });
}

async function gerarQRCodes() {
  console.log('🔄 Gerando QR codes das mesas...');
  
  try {
    // Perguntar tipo de URL
    const baseUrl = await perguntarTipoURL();
    
    console.log(`\n✅ Usando URL: ${baseUrl}\n`);
    
    // Criar pasta se não existir
    const pastaQR = path.join(__dirname, '..', 'qr_codes');
    if (!fs.existsSync(pastaQR)) {
      fs.mkdirSync(pastaQR, { recursive: true });
    }
    
    // Buscar todas as mesas
    const mesas = await prisma.mesa.findMany({
      where: { activa: true },
      orderBy: { numero: 'asc' }
    });
    
    if (mesas.length === 0) {
      console.log('⚠️  Nenhuma mesa encontrada. Execute primeiro: npm run db:seed');
      return;
    }
    
    // Gerar QR code para cada mesa
    for (const mesa of mesas) {
      const url = `${baseUrl}/mesa/${mesa.id}?token=${mesa.qrToken}`;
      const nomeArquivo = path.join(pastaQR, `mesa_${mesa.numero}.png`);
      
      await QRCode.toFile(nomeArquivo, url, {
        width: 400,
        margin: 2,
        color: {
          dark: '#085041',  // Verde escuro
          light: '#FFFFFF'  // Branco
        }
      });
      
      console.log(`✅ Mesa ${mesa.numero}: ${nomeArquivo}`);
      console.log(`   URL: ${url}`);
    }
    
    // Gerar HTML com todos os QR codes para impressão
    const html = gerarHtmlImpressao(mesas, baseUrl);
    const htmlPath = path.join(pastaQR, 'imprimir_todos.html');
    fs.writeFileSync(htmlPath, html);
    
    console.log(`\n🎉 ${mesas.length} QR codes gerados com sucesso!`);
    console.log(`📁 Pasta: ${pastaQR}`);
    console.log(`🖨️  Para imprimir todos: abra ${htmlPath} no browser`);
    console.log(`\n💡 Dica: Para acessar do celular, use: ${baseUrl}`);
    
  } catch (erro) {
    console.error('❌ Erro ao gerar QR codes:', erro);
  } finally {
    await prisma.$disconnect();
  }
}

function gerarHtmlImpressao(mesas, baseUrl) {
  const qrHtml = mesas.map(mesa => `
    <div class="qr-card">
      <h2>Mesa ${mesa.numero}</h2>
      <img src="mesa_${mesa.numero}.png" alt="QR Code Mesa ${mesa.numero}">
      <p class="instrucao">📱 Escaneia para fazer o pedido</p>
      <p class="lanchonete">🍔 Lanchonete da Fátima</p>
    </div>
  `).join('\n');
  
  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QR Codes - Lanchonete</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f5f5f5;
    }
    
    .container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .qr-card {
      background: white;
      border: 3px solid #085041;
      border-radius: 15px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      page-break-inside: avoid;
    }
    
    .qr-card h2 {
      color: #085041;
      font-size: 32px;
      margin-bottom: 20px;
    }
    
    .qr-card img {
      width: 100%;
      max-width: 300px;
      height: auto;
      margin: 20px 0;
    }
    
    .instrucao {
      font-size: 18px;
      color: #333;
      margin: 15px 0;
      font-weight: bold;
    }
    
    .lanchonete {
      font-size: 20px;
      color: #085041;
      font-weight: bold;
      margin-top: 10px;
    }
    
    @media print {
      body {
        background: white;
      }
      
      .qr-card {
        box-shadow: none;
        page-break-inside: avoid;
      }
    }
    
    .no-print {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .btn-imprimir {
      background: #085041;
      color: white;
      border: none;
      padding: 15px 30px;
      font-size: 18px;
      border-radius: 8px;
      cursor: pointer;
      margin: 10px;
    }
    
    .btn-imprimir:hover {
      background: #0a6b52;
    }
    
    @media print {
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <h1 style="text-align: center; color: #085041; margin-bottom: 20px;">
      🍔 QR Codes - Lanchonete da Fátima
    </h1>
    <button class="btn-imprimir" onclick="window.print()">
      🖨️ Imprimir Todos
    </button>
  </div>
  
  <div class="container">
    ${qrHtml}
  </div>
</body>
</html>
  `;
}

// Executar
gerarQRCodes();
