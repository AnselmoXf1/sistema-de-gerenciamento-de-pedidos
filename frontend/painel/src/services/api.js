import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    
    const mensagem = error.response?.data?.erro || 'Erro ao comunicar com o servidor';
    throw new Error(mensagem);
  }
);

// Auth
export async function login(email, senha) {
  const response = await api.post('/auth/login', { email, senha });
  return response.data;
}

// Pedidos
export async function buscarPedidosActivos() {
  const response = await api.get('/painel/pedidos');
  return response.data;
}

export async function actualizarStatusPedido(pedidoId, status) {
  const response = await api.patch(`/painel/pedidos/${pedidoId}`, { status });
  return response.data;
}

export async function enviarSmsPedido(pedidoId) {
  const response = await api.post(`/painel/pedidos/${pedidoId}/notificar`);
  return response.data;
}

// Histórico
export async function buscarHistorico(filtros = {}) {
  const params = new URLSearchParams(filtros);
  const response = await api.get(`/painel/historico?${params}`);
  return response.data;
}

// Relatórios
export async function buscarRelatorioDia(data) {
  const params = data ? `?data=${data}` : '';
  const response = await api.get(`/painel/relatorios/dia${params}`);
  return response.data;
}

export default api;
