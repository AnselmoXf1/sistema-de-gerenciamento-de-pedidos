import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import '../styles/CarrinhoBar.css';

function CarrinhoBar() {
  const navigate = useNavigate();
  const { totalItens, calcularTotal } = useCarrinho();

  if (totalItens === 0) return null;

  return (
    <div className="carrinho-bar">
      <div className="carrinho-info">
        <span className="carrinho-itens">
          🛒 {totalItens} {totalItens === 1 ? 'item' : 'itens'}
        </span>
        <span className="carrinho-total">
          {calcularTotal().toFixed(2).replace('.', ',')} MT
        </span>
      </div>
      <button
        className="btn btn-success btn-ver-carrinho"
        onClick={() => navigate('/resumo')}
      >
        Ver Carrinho →
      </button>
    </div>
  );
}

export default CarrinhoBar;
