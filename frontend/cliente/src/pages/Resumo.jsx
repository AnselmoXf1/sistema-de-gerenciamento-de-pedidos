import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import { criarPedido } from '../services/api';
import '../styles/Resumo.css';

function Resumo() {
  const navigate = useNavigate();
  const { carrinho, mesaId, mesaNumero, calcularTotal, limparCarrinho, removerItem, adicionarItem } = useCarrinho();
  
  const [formaPagamento, setFormaPagamento] = useState('');
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [telefone, setTelefone] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  if (carrinho.length === 0) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>🛒 Carrinho vazio</h2>
        <p style={{ margin: '20px 0', color: 'var(--gray-600)' }}>
          Adiciona produtos ao carrinho para continuar
        </p>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          ← Voltar ao cardápio
        </button>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!formaPagamento) {
      setErro('Escolhe uma forma de pagamento');
      return;
    }
    
    if (smsOptIn && !telefone) {
      setErro('Introduz o número de telefone para receber SMS');
      return;
    }
    
    try {
      setLoading(true);
      setErro(null);
      
      const dados = {
        mesaId,
        itens: carrinho.map(item => ({
          produtoId: item.id,
          quantidade: item.quantidade
        })),
        formaPagamento,
        smsOptIn,
        telefoneSms: smsOptIn ? telefone : null,
        observacoes: observacoes || null
      };
      
      const resultado = await criarPedido(dados);
      
      limparCarrinho();
      navigate(`/confirmacao/${resultado.pedido.ticketNum}`);
      
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  const total = calcularTotal();

  return (
    <div className="resumo-page">
      <header className="resumo-header">
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <h1>Resumo do Pedido</h1>
        <div className="mesa-badge">Mesa {mesaNumero || mesaId}</div>
      </header>

      <div className="container">
        {erro && <div className="error">{erro}</div>}
        
        <div className="card itens-card">
          <h2>🛒 Itens do Pedido</h2>
          {carrinho.map(item => (
            <div key={item.id} className="item-resumo">
              <div className="item-info">
                <span className="item-emoji">{item.emoji}</span>
                <div>
                  <p className="item-nome">{item.nome}</p>
                  <p className="item-preco">
                    {Number(item.preco).toFixed(2).replace('.', ',')} MT × {item.quantidade}
                  </p>
                </div>
              </div>
              <div className="item-acoes">
                <div className="quantidade-controls-small">
                  <button onClick={() => removerItem(item.id)}>−</button>
                  <span>{item.quantidade}</span>
                  <button onClick={() => adicionarItem(item)}>+</button>
                </div>
                <p className="item-subtotal">
                  {(Number(item.preco) * item.quantidade).toFixed(2).replace('.', ',')} MT
                </p>
              </div>
            </div>
          ))}
          
          <div className="total-resumo">
            <span>Total:</span>
            <span className="total-valor">{total.toFixed(2).replace('.', ',')} MT</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            <h2>💳 Forma de Pagamento</h2>
            <div className="pagamento-opcoes">
              <label className={`pagamento-opcao ${formaPagamento === 'mpesa' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="pagamento"
                  value="mpesa"
                  checked={formaPagamento === 'mpesa'}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                />
                <span className="opcao-content">
                  <span className="opcao-icon">📱</span>
                  <span>M-Pesa</span>
                </span>
              </label>
              
              <label className={`pagamento-opcao ${formaPagamento === 'emola' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="pagamento"
                  value="emola"
                  checked={formaPagamento === 'emola'}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                />
                <span className="opcao-content">
                  <span className="opcao-icon">💰</span>
                  <span>e-Mola</span>
                </span>
              </label>
              
              <label className={`pagamento-opcao ${formaPagamento === 'dinheiro' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="pagamento"
                  value="dinheiro"
                  checked={formaPagamento === 'dinheiro'}
                  onChange={(e) => setFormaPagamento(e.target.value)}
                />
                <span className="opcao-content">
                  <span className="opcao-icon">💵</span>
                  <span>Dinheiro</span>
                </span>
              </label>
            </div>
            <p className="pagamento-nota">
              💡 Paga na caixa ao buscar o pedido
            </p>
          </div>

          <div className="card">
            <h2>📱 Notificação SMS</h2>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={smsOptIn}
                onChange={(e) => setSmsOptIn(e.target.checked)}
              />
              <span>Quero receber SMS quando o pedido estiver pronto</span>
            </label>
            
            {smsOptIn && (
              <div className="telefone-input fade-in">
                <label>Número de telefone:</label>
                <input
                  type="tel"
                  placeholder="+258 84 123 4567"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  required={smsOptIn}
                />
                <small>Formato: +258XXXXXXXXX ou 8XXXXXXXX</small>
              </div>
            )}
          </div>

          <div className="card">
            <h2>📝 Observações (opcional)</h2>
            <textarea
              placeholder="Ex: Sem cebola, bem passado, etc."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success btn-lg btn-block"
            disabled={loading}
          >
            {loading ? '⏳ A processar...' : '✅ Confirmar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Resumo;
