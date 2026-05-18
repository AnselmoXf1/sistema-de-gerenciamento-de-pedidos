const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
});

// Testar conexão
prisma.$connect()
  .then(() => console.log('✅ Conectado à base de dados PostgreSQL'))
  .catch((err) => {
    console.error('❌ Erro ao conectar à base de dados:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('🔌 Desconectado da base de dados');
});

module.exports = prisma;
