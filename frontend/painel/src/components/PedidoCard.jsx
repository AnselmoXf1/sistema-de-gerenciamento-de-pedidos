import { useState } from 'react';
import { actualizarStatusPedido, enviarSmsPedido } from '../services/api';
import { tocarSucesso } from '../utils/audio';
import '../styles/PedidoCard.css';

const STATUS_CONFIG = {
  aguardando: {
    cor: '#f59e0b',
    emoji: '⏳',
    label: 'Aguardando',
    proximoStatus: 'em_preparo',
    proximaAcao: 'Confirmar'
  },
  em_preparo: {
    cor: '#3b82f6',
    emoji: '👨‍🍳',
    label: 'Em Preparo',
    proximoStatus: 'pronto',
    proximaAcao: 'Marcar Pronto'
  },
  pronto: {
    cor: '#10b981',
    emoji: '✅',
    label: 'Pronto',
    proximoStatus: 'entregue',
    proximaAcao: 'Marcar Entregue'
  },
  entregue: {
    cor: '#6b7280',
    emoji: '🎉',
    label: 'Entregue',
    proximoStatus: null,
    proximaAcao: null
  }
};

function PedidoCard({ pedido, onActualizar }) {
  const [loading, setLoading] = useState(false);
  const [enviandoSms, setEnviandoSms] = useState(false);
  const [erro, setErro] = useState(null);

  const config = STATUS_CONFIG[pedido.status] || STATUS_CONFIG.aguardando;

  async function handleMudarStatus() {
    if (!config.proximoStatus) return;
    
    try {
      setLoading(true);
      setErro(null);
      
      await actualizarStatusPedido(pedido.id, config.proximoStatus);
      tocarSucesso();
      
      if (onActualizar) onActualizar();
      
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleEnviarSms() {
    try {
      setEnviandoSms(true);
      setErro(null);
      
      await enviarSmsPedido(pedido.id);
      tocarSucesso();
      alert('SMS enviado com sucesso!');
      
      if (onActualizar) onActualizar();
      
    } catch (err) {
      setErro(err.message);
      alert(`Erro ao enviar SMS: ${err.message}`);
    } finally {
      setEnviandoSms(false);
    }
  }

  const tempoDecorrido = () => {
    const agora = new Date();
    const criado = new Date(pedido.criadoEm);
    const minutos = Math.floor((agora - criado) / 1000 / 60);
    
    if (minutos < 1) return 'Agora mesmo';
    if (minutos === 1) return '1 minuto atrás';
    if (minutos < 60) return `${minutos} minutos atrás`;
    
    const horas = Math.floor(minutos / 60);
    return `${horas}h ${minutos % 60}m atrás`;
  };

  return (
    <div className="pedido-card" style={{ borderLeftColor: config.cor }}>
      <div className="pedido-header">
        <div className="pedido-ticket">
          <span className="ticket-emoji">{config.emoji}</span>
          <div>
            <h3>#{pedido.ticketNum}</h3>
            <span className="pedido-status" style={{ color: config.cor }}>
              {config.label}
            </span>
          </div>
        </div>
        
        <div className="pedido-mesa">
          <span className="mesa-badge">Mesa {pedido.mesa.numero}</span>
          <span className="pedido-tempo">{tempoDecorrido()}</span>
        </div>
      </div>

      {erro && <div className="error-message-small">{erro}</div>}

      <div className="pedido-itens">
        {pedido.itens.map((item, index) => (
          <div key={index} className="item-linha">
            <span className="item-emoji">{item.produto.emoji}</span>
            <span className="item-qtd">{item.quantidade}x</span>
            <span className="item-nome">{item.produto.nome}</span>
            <span className="item-preco">
              {Number(item.subtotal).toFixed(2).replace('.', ',')} MT
            </span>
          </div>
        ))}
      </div>

      <div className="pedido-footer">
        <div className="pedido-info">
          <div className="info-item">
            <span className="info-label">Total:</span>
            <span className="info-valor total">
              {Number(pedido.totalMt).toFixed(2).replace('.', ',')} MT
            </span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Pagamento:</span>
            <span className="info-valor">
              {pedido.formaPagamento === 'mpesa' && '📱 M-Pesa'}
              {pedido.formaPagamento === 'emola' && '💰 e-Mola'}
              {pedido.formaPagamento === 'dinheiro' && '💵 Dinheiro'}
            </span>
          </div>
          
          {pedido.smsOptIn && (
            <div className="info-item">
              <span className="info-label">SMS:</span>
              <span className="info-valor">
                {pedido.smsEnviado ? '✅ Enviado' : '⏳ Pendente'}
              </span>
            </div>
          )}
        </div>

        {pedido.observacoes && (
          <div className="pedido-observacoes">
            <strong>📝 Obs:</strong> {pedido.observacoes}
          </div>
        )}
      </div>

      <div className="pedido-acoes">
        {config.proximaAcao && (
          <button
            className="btn btn-primary btn-block"
            onClick={handleMudarStatus}
            disabled={loading}
          >
            {loading ? '⏳ A processar...' : `${config.proximaAcao} →`}
          </button>
        )}
        
        {pedido.smsOptIn && !pedido.smsEnviado && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleEnviarSms}
            disabled={enviandoSms}
          >
            {enviandoSms ? '📤 A enviar...' : '📱 Enviar SMS'}
          </button>
        )}
      </div>
    </div>
  );
}

export default PedidoCard;
