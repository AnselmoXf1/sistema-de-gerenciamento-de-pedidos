import { io } from 'socket.io-client';

let socket = null;

export function conectarSocket() {
  if (socket) return socket;
  
  const url = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
  
  socket = io(url, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });
  
  socket.on('connect', () => {
    console.log('✅ Socket conectado:', socket.id);
    socket.emit('entrar-painel');
  });
  
  socket.on('disconnect', () => {
    console.log('❌ Socket desconectado');
  });
  
  socket.on('connect_error', (error) => {
    console.error('❌ Erro de conexão Socket:', error);
  });
  
  return socket;
}

export function desconectarSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

export default {
  conectar: conectarSocket,
  desconectar: desconectarSocket,
  get: getSocket
};
