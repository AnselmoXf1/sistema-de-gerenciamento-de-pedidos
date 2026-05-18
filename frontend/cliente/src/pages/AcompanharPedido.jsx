import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { buscarPedido } from '../services/api';
import '../styles/AcompanharPedido.css';

const STATUS_INFO = {
  aguardando: {
    emoji: '⏳',
    titulo: 'Aguardando Confirmação',
    descricao: 'O teu pedido foi recebido e está na fila',
    cor: '#f59e0b'
  },
  em_preparo: {
    emoji: '👨‍🍳',
    titulo: 'Em Preparação',
    descricao: 'Estamos a preparar o teu pedido',
    cor: '#3b82f6'
  },
  pronto: {
    emoji: '✅',
    titulo: 'Pronto!',
    descricao: 'O teu pedido está pronto. Vai buscar na caixa!',
    cor: '#10b981'
  },
  entregue: {
    emoji: '🎉',
    titulo: 'Entregue',
    descricao: 'Pedido entregue. Bom apetite!',
    cor: '#6b7280'
  }
};

function AcompanharPedido() {
  const { ticketNum } = useParams();
  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarPedido();
    
    // Atualizar a cada 10 segundos
    const intervalo = setInterval(carregarPedido, 10000);
    
    return () => clearInterval(intervalo);
  }, [ticketNum]);

  async function carregarPedido() {
    try {
      setErro(null);
      const dados = await buscarPedido(ticketNum);
      setPedido(dados);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">🔄 A carregar pedido...</div>;
  }

  if (erro) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <div className="error">{erro}</div>
        <button className="btn btn-primary" onClick={carregarPedido}>
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!pedido) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Pedido não encontrado</h2>
        <p>Verifica o número do pedido e tenta novamente</p>
      </div>
    );
  }

  const statusInfo = STATUS_INFO[pedido.status] || STATUS_INFO.aguardando;

  return (
    <div className="acompanhar-page">
      <div className="container">
        <div className="status-card" style={{ borderColor: statusInfo.cor }}>
          <div className="status-emoji">{statusInfo.emoji}</div>
          <h1>{statusInfo.titulo}</h1>
          <p className="status-descricao">{statusInfo.descricao}</p>
          
          <div className="ticket-info">
            <span>Pedido:</span>
            <strong>#{pedido.ticketNum}</strong>
          </div>
          
          <div className="mesa-info-badge">
            Mesa {pedido.mesaNumero}
          </div>
        </div>

        <div className="card">
          <h2>📋 Itens do Pedido</h2>
          <div className="itens-lista">
            {pedido.itens.map((item, index) => (
              <div key={index} className="item-linha">
                <span className="item-qtd">{item.quantidade}x</span>
                <span className="item-nome-acomp">{item.produto}</span>
                <span className="item-valor">
                  {Number(item.subtotal).toFixed(2).replace('.', ',')} MT
                </span>
              </div>
            ))}
          </div>
          
          <div className="total-linha">
            <span>Total:</span>
            <strong>{Number(pedido.totalMt).toFixed(2).replace('.', ',')} MT</strong>
          </div>
        </div>

        <div className="timeline">
          <div className={`timeline-item ${['aguardando', 'em_preparo', 'pronto', 'entregue'].includes(pedido.status) ? 'completed' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <strong>Pedido Recebido</strong>
              <small>{new Date(pedido.criadoEm).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}</small>
            </div>
          </div>
          
          <div className={`timeline-item ${['em_preparo', 'pronto', 'entregue'].includes(pedido.status) ? 'completed' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <strong>Em Preparação</strong>
            </div>
          </div>
          
          <div className={`timeline-item ${['pronto', 'entregue'].includes(pedido.status) ? 'completed' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <strong>Pronto</strong>
            </div>
          </div>
          
          <div className={`timeline-item ${pedido.status === 'entregue' ? 'completed' : ''}`}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <strong>Entregue</strong>
            </div>
          </div>
        </div>

        <button className="btn btn-secondary btn-block" onClick={carregarPedido}>
          🔄 Actualizar Status
        </button>
      </div>
    </div>
  );
}

export default AcompanharPedido;
