const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.BASE_URL 
      : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
  }
});

// Middlewares globais
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Disponibilizar io para as rotas
app.set('io', io);

// Rotas
const cardapioRoutes = require('./routes/cardapio');
const pedidosRoutes = require('./routes/pedidos');
const painelRoutes = require('./routes/painel');
const authRoutes = require('./routes/auth');

app.use('/api/cardapio', cardapioRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/painel', painelRoutes);
app.use('/api/auth', authRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: '🍔 Lanchonete Digital API',
    version: '1.0.0',
    endpoints: {
      cardapio: '/api/cardapio',
      pedidos: '/api/pedidos',
      painel: '/api/painel',
      auth: '/api/auth/login'
    }
  });
});

// Socket.io - Conexões em tempo real
io.on('connection', (socket) => {
  console.log('✅ Cliente conectado:', socket.id);
  
  // Entrar na sala do painel
  socket.on('entrar-painel', () => {
    socket.join('painel');
    console.log('📊 Cliente entrou no painel');
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado:', socket.id);
  });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error('❌ Erro:', err);
  res.status(err.status || 500).json({
    erro: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 - Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('🚀 Servidor rodando na porta', PORT);
  console.log('🌐 URL:', process.env.BASE_URL || `http://localhost:${PORT}`);
  console.log('📡 Socket.io pronto para conexões em tempo real');
  console.log('✅ Ambiente:', process.env.NODE_ENV || 'development');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM recebido, encerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor encerrado');
    process.exit(0);
  });
});

module.exports = { app, io };
