require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { gerarQrToken } = require('../utils/helpers');

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed da base de dados...');
  
  try {
    // 1. Criar usuário admin
    console.log('👤 Criando usuário admin...');
    const senhaHash = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.usuario.upsert({
      where: { email: 'admin@lanchonete.mz' },
      update: {},
      create: {
        nome: 'Administrador',
        email: 'admin@lanchonete.mz',
        senhaHash,
        role: 'dona'
      }
    });
    console.log('✅ Admin criado:', admin.email);
    
    // 2. Criar mesas
    console.log('🪑 Criando mesas...');
    const mesas = [];
    for (let i = 1; i <= 10; i++) {
      const mesa = await prisma.mesa.upsert({
        where: { numero: i },
        update: {},
        create: {
          numero: i,
          qrToken: gerarQrToken(),
          activa: true
        }
      });
      mesas.push(mesa);
    }
    console.log(`✅ ${mesas.length} mesas criadas`);
    
    // 3. Criar produtos do cardápio
    console.log('🍔 Criando produtos...');
    
    const produtos = [
      // Pratos
      {
        nome: 'Hambúrguer Clássico',
        descricao: 'Pão, carne, queijo, alface, tomate',
        preco: 250.00,
        categoria: 'prato',
        emoji: '🍔',
        ordem: 1
      },
      {
        nome: 'Hambúrguer Duplo',
        descricao: 'Pão, 2 carnes, queijo duplo, molho especial',
        preco: 350.00,
        categoria: 'prato',
        emoji: '🍔',
        ordem: 2
      },
      {
        nome: 'Cachorro Quente',
        descricao: 'Pão, salsicha, batata palha, molhos',
        preco: 150.00,
        categoria: 'prato',
        emoji: '🌭',
        ordem: 3
      },
      {
        nome: 'Rissóis de Camarão',
        descricao: '4 unidades crocantes',
        preco: 200.00,
        categoria: 'prato',
        emoji: '🦐',
        ordem: 4
      },
      {
        nome: 'Batata Frita Grande',
        descricao: 'Porção grande de batatas crocantes',
        preco: 120.00,
        categoria: 'prato',
        emoji: '🍟',
        ordem: 5
      },
      {
        nome: 'Frango Assado',
        descricao: '1/4 de frango com batata',
        preco: 280.00,
        categoria: 'prato',
        emoji: '🍗',
        ordem: 6
      },
      
      // Bebidas
      {
        nome: 'Coca-Cola 500ml',
        descricao: 'Refrigerante gelado',
        preco: 50.00,
        categoria: 'bebida',
        emoji: '🥤',
        ordem: 1
      },
      {
        nome: 'Fanta Laranja 500ml',
        descricao: 'Refrigerante gelado',
        preco: 50.00,
        categoria: 'bebida',
        emoji: '🥤',
        ordem: 2
      },
      {
        nome: 'Sprite 500ml',
        descricao: 'Refrigerante gelado',
        preco: 50.00,
        categoria: 'bebida',
        emoji: '🥤',
        ordem: 3
      },
      {
        nome: 'Água Mineral 500ml',
        descricao: 'Água natural gelada',
        preco: 30.00,
        categoria: 'bebida',
        emoji: '💧',
        ordem: 4
      },
      {
        nome: 'Sumo Natural',
        descricao: 'Laranja, manga ou maracujá',
        preco: 80.00,
        categoria: 'bebida',
        emoji: '🧃',
        ordem: 5
      },
      {
        nome: '2M Cerveja',
        descricao: 'Cerveja moçambicana 330ml',
        preco: 70.00,
        categoria: 'bebida',
        emoji: '🍺',
        ordem: 6
      },
      
      // Sobremesas
      {
        nome: 'Gelado Baunilha',
        descricao: '2 bolas com cobertura',
        preco: 100.00,
        categoria: 'sobremesa',
        emoji: '🍦',
        ordem: 1
      },
      {
        nome: 'Gelado Chocolate',
        descricao: '2 bolas com cobertura',
        preco: 100.00,
        categoria: 'sobremesa',
        emoji: '🍦',
        ordem: 2
      },
      {
        nome: 'Bolo de Chocolate',
        descricao: 'Fatia generosa',
        preco: 120.00,
        categoria: 'sobremesa',
        emoji: '🍰',
        ordem: 3
      }
    ];
    
    // Verificar se já existem produtos
    const produtosExistentes = await prisma.produto.count();
    
    if (produtosExistentes === 0) {
      await prisma.produto.createMany({
        data: produtos,
        skipDuplicates: true
      });
      console.log(`✅ ${produtos.length} produtos criados`);
    } else {
      console.log(`ℹ️  ${produtosExistentes} produtos já existem, pulando criação`);
    }
    
    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('   Email: admin@lanchonete.mz');
    console.log('   Senha: admin123');
    console.log('\n🔗 URLs das mesas:');
    mesas.slice(0, 3).forEach(mesa => {
      console.log(`   Mesa ${mesa.numero}: http://localhost:3000/mesa/${mesa.id}?token=${mesa.qrToken}`);
    });
    console.log('   ...');
    
  } catch (erro) {
    console.error('❌ Erro no seed:', erro);
    throw erro;
  } finally {
    await prisma.$disconnect();
  }
}

seed()
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
