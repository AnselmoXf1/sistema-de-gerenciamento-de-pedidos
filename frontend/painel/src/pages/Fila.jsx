import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { buscarPedidosActivos } from '../services/api';
import { conectarSocket, desconectarSocket, getSocket } from '../services/socket';
import { tocarNotificacao, solicitarPermissaoNotificacao, mostrarNotificacao } from '../utils/audio';
import Layout from '../components/Layout';
import PedidoCard from '../components/PedidoCard';
import '../styles/Fila.css';

const FILTROS = {
  TODOS: 'todos',
  AGUARDANDO: 'aguardando',
  EM_PREPARO: 'em_preparo',
  PRONTO: 'pronto'
};

function Fila() {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState(FILTROS.TODOS);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [ultimaActualizacao, setUltimaActualizacao] = useState(new Date());

  useEffect(() => {
    carregarPedidos();
    
    // Polling a cada 5 segundos
    const intervalo = setInterval(carregarPedidos, 5000);
    
    // Socket.io para tempo real
    const socket = conectarSocket();
    
    socket.on('novo-pedido', (pedido) => {
      console.log('🆕 Novo pedido recebido:', pedido.ticketNum);
      
      setPedidos(prev => [pedido, ...prev]);
      tocarNotificacao();
      
      mostrarNotificacao('Novo Pedido!', {
        body: `Mesa ${pedido.mesa.numero} - ${pedido.ticketNum}`,
        tag: 'novo-pedido'
      });
    });
    
    socket.on('pedido-actualizado', (pedido) => {
      console.log('🔄 Pedido actualizado:', pedido.ticketNum);
      
      setPedidos(prev => 
        prev.map(p => p.id === pedido.id ? pedido : p)
      );
    });
    
    // Solicitar permissão para notificações
    solicitarPermissaoNotificacao();
    
    return () => {
      clearInterval(intervalo);
      desconectarSocket();
    };
  }, []);

  async function carregarPedidos() {
    try {
      setErro(null);
      const dados = await buscarPedidosActivos();
      setPedidos(dados.pedidos);
      setUltimaActualizacao(new Date());
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  const pedidosFiltrados = filtro === FILTROS.TODOS
    ? pedidos
    : pedidos.filter(p => p.status === filtro);

  const contadores = {
    aguardando: pedidos.filter(p => p.status === 'aguardando').length,
    em_preparo: pedidos.filter(p => p.status === 'em_preparo').length,
    pronto: pedidos.filter(p => p.status === 'pronto').length
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>A carregar pedidos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="fila-page">
        <div className="fila-header">
          <div className="header-info">
            <h1>📋 Fila de Pedidos</h1>
            <p className="ultima-atualizacao">
              Última actualização: {ultimaActualizacao.toLocaleTimeString('pt-PT')}
            </p>
          </div>
          
          <button 
            className="btn btn-secondary"
            onClick={carregarPedidos}
          >
            🔄 Actualizar
          </button>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        <div className="filtros-tabs">
          <button
            className={`filtro-tab ${filtro === FILTROS.TODOS ? 'activo' : ''}`}
            onClick={() => setFiltro(FILTROS.TODOS)}
          >
            Todos ({pedidos.length})
          </button>
          
          <button
            className={`filtro-tab ${filtro === FILTROS.AGUARDANDO ? 'activo' : ''}`}
            onClick={() => setFiltro(FILTROS.AGUARDANDO)}
          >
            ⏳ Aguardando
            {contadores.aguardando > 0 && (
              <span className="badge badge-warning">{contadores.aguardando}</span>
            )}
          </button>
          
          <button
            className={`filtro-tab ${filtro === FILTROS.EM_PREPARO ? 'activo' : ''}`}
            onClick={() => setFiltro(FILTROS.EM_PREPARO)}
          >
            👨‍🍳 Em Preparo
            {contadores.em_preparo > 0 && (
              <span className="badge badge-info">{contadores.em_preparo}</span>
            )}
          </button>
          
          <button
            className={`filtro-tab ${filtro === FILTROS.PRONTO ? 'activo' : ''}`}
            onClick={() => setFiltro(FILTROS.PRONTO)}
          >
            ✅ Pronto
            {contadores.pronto > 0 && (
              <span className="badge badge-success">{contadores.pronto}</span>
            )}
          </button>
        </div>

        <div className="pedidos-grid">
          {pedidosFiltrados.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Nenhum pedido</h3>
              <p>
                {filtro === FILTROS.TODOS 
                  ? 'Não há pedidos activos no momento'
                  : `Não há pedidos com status "${filtro}"`
                }
              </p>
            </div>
          ) : (
            pedidosFiltrados.map(pedido => (
              <PedidoCard 
                key={pedido.id} 
                pedido={pedido}
                onActualizar={carregarPedidos}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Fila;
