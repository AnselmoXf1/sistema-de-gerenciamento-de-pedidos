const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function initDatabase() {
  console.log('🔄 Inicializando banco de dados...');
  
  try {
    // Verificar se já existem dados
    const userCount = await prisma.usuario.count();
    
    if (userCount > 0) {
      console.log('✅ Banco de dados já inicializado!');
      return;
    }
    
    console.log('📝 Criando dados iniciais...');
    
    // Criar usuário admin
    const senhaHash = await bcrypt.hash('admin123', 10);
    await prisma.usuario.create({
      data: {
        nome: 'Administrador',
        username: 'admin',
        senha: senhaHash,
        role: 'admin'
      }
    });
    console.log('✅ Usuário admin criado');
    
    // Criar mesas
    const mesas = [];
    for (let i = 1; i <= 10; i++) {
      const mesa = await prisma.mesa.create({
        data: {
          numero: i,
          qrToken: `mesa-${i}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          activa: true
        }
      });
      mesas.push(mesa);
    }
    console.log(`✅ ${mesas.length} mesas criadas`);
    
    // Criar produtos
    const produtos = [
      // Lanches
      { nome: 'Hambúrguer Clássico', descricao: 'Pão, carne, queijo, alface, tomate', preco: 150.00, categoria: 'lanches', disponivel: true },
      { nome: 'Hambúrguer Duplo', descricao: 'Pão, 2 carnes, queijo duplo, bacon', preco: 200.00, categoria: 'lanches', disponivel: true },
      { nome: 'Hambúrguer Vegetariano', descricao: 'Pão, hambúrguer de soja, queijo, vegetais', preco: 140.00, categoria: 'lanches', disponivel: true },
      { nome: 'Cachorro Quente', descricao: 'Pão, salsicha, batata palha, milho, ervilha', preco: 100.00, categoria: 'lanches', disponivel: true },
      
      // Bebidas
      { nome: 'Coca-Cola 500ml', descricao: 'Refrigerante', preco: 50.00, categoria: 'bebidas', disponivel: true },
      { nome: 'Fanta 500ml', descricao: 'Refrigerante de laranja', preco: 50.00, categoria: 'bebidas', disponivel: true },
      { nome: 'Água Mineral 500ml', descricao: 'Água sem gás', preco: 30.00, categoria: 'bebidas', disponivel: true },
      { nome: 'Sumo Natural', descricao: 'Laranja, manga ou maracujá', preco: 60.00, categoria: 'bebidas', disponivel: true },
      
      // Acompanhamentos
      { nome: 'Batata Frita', descricao: 'Porção de batatas fritas crocantes', preco: 80.00, categoria: 'acompanhamentos', disponivel: true },
      { nome: 'Onion Rings', descricao: 'Anéis de cebola empanados', preco: 90.00, categoria: 'acompanhamentos', disponivel: true },
      
      // Sobremesas
      { nome: 'Sorvete', descricao: 'Baunilha, chocolate ou morango', preco: 70.00, categoria: 'sobremesas', disponivel: true },
      { nome: 'Pudim', descricao: 'Pudim de leite condensado', preco: 60.00, categoria: 'sobremesas', disponivel: true }
    ];
    
    for (const produto of produtos) {
      await prisma.produto.create({ data: produto });
    }
    console.log(`✅ ${produtos.length} produtos criados`);
    
    console.log('\n🎉 Banco de dados inicializado com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`   • 1 usuário admin`);
    console.log(`   • ${mesas.length} mesas`);
    console.log(`   • ${produtos.length} produtos`);
    console.log('\n🔐 Credenciais de acesso:');
    console.log('   Usuário: admin');
    console.log('   Senha: admin123');
    
  } catch (erro) {
    console.error('❌ Erro ao inicializar banco:', erro);
    throw erro;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch((erro) => {
      console.error(erro);
      process.exit(1);
    });
}

module.exports = { initDatabase };
