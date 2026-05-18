import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Confirmacao.css';

function Confirmacao() {
  const { ticketNum } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Limpar dados da sessão
    localStorage.removeItem('carrinho');
  }, []);

  return (
    <div className="confirmacao-page">
      <div className="container">
        <div className="confirmacao-card">
          <div className="sucesso-icon">✅</div>
          
          <h1>Pedido Confirmado!</h1>
          
          <div className="ticket-display">
            <p className="ticket-label">Número do Pedido:</p>
            <p className="ticket-numero">#{ticketNum}</p>
          </div>
          
          <div className="instrucoes">
            <h2>📋 Próximos Passos:</h2>
            <ol>
              <li>Aguarda a preparação do teu pedido</li>
              <li>Receberás SMS quando estiver pronto (se activaste)</li>
              <li>Vai à caixa para pagar e buscar</li>
            </ol>
          </div>
          
          <div className="info-box">
            <p>💡 <strong>Dica:</strong> Guarda o número do pedido para acompanhar o status</p>
          </div>
          
          <div className="acoes">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate(`/pedido/${ticketNum}`)}
            >
              📊 Acompanhar Pedido
            </button>
            
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              🏠 Voltar ao Início
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmacao;
