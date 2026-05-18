import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na API:', error);
    
    if (error.response) {
      // Erro com resposta do servidor
      throw new Error(error.response.data.erro || 'Erro ao comunicar com o servidor');
    } else if (error.request) {
      // Erro de rede
      throw new Error('Sem conexão com o servidor. Verifica a tua internet.');
    } else {
      throw new Error('Erro inesperado');
    }
  }
);

// Validar mesa
export async function validarMesa(mesaId, token) {
  const response = await api.get(`/pedidos/mesa/${mesaId}/validar`, {
    params: { token }
  });
  return response.data;
}

// Buscar cardápio
export async function buscarCardapio() {
  const response = await api.get('/cardapio');
  return response.data;
}

// Criar pedido
export async function criarPedido(dados) {
  const response = await api.post('/pedidos', dados);
  return response.data;
}

// Buscar pedido pelo ticket
export async function buscarPedido(ticketNum) {
  const response = await api.get(`/pedidos/${ticketNum}`);
  return response.data;
}

export default api;
