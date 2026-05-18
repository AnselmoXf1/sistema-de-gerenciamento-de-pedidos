const os = require('os');

console.log('\n📱 Informações de Rede\n');
console.log('═'.repeat(50));

// Obter todas as interfaces de rede
const interfaces = os.networkInterfaces();

let encontrouIP = false;

for (const nome in interfaces) {
  const ifaces = interfaces[nome];
  
  for (const iface of ifaces) {
    // Mostrar apenas IPv4 não-internos
    if (iface.family === 'IPv4' && !iface.internal) {
      encontrouIP = true;
      
      console.log(`\n🌐 Interface: ${nome}`);
      console.log(`   IP: ${iface.address}`);
      console.log(`   Máscara: ${iface.netmask}`);
      
      console.log('\n📱 URLs para acessar do celular:');
      console.log(`   Cliente: http://${iface.address}:5173`);
      console.log(`   Painel:  http://${iface.address}:5174`);
      console.log(`   Backend: http://${iface.address}:3000`);
    }
  }
}

if (!encontrouIP) {
  console.log('\n⚠️  Nenhuma interface de rede encontrada.');
  console.log('   Verifique se está conectado à rede WiFi.');
}

console.log('\n' + '═'.repeat(50));
console.log('\n💡 Dicas:');
console.log('   • Celular e computador devem estar na mesma rede WiFi');
console.log('   • Use o IP mostrado acima no celular');
console.log('   • Se não funcionar, verifique o firewall');
console.log('\n📚 Mais informações: GUIA_ACESSO_MOBILE.md\n');
