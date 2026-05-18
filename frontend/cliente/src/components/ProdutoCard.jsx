import { useCarrinho } from '../context/CarrinhoContext';
import '../styles/ProdutoCard.css';

function ProdutoCard({ produto }) {
  const { carrinho, adicionarItem, removerItem } = useCarrinho();
  
  const itemNoCarrinho = carrinho.find(item => item.id === produto.id);
  const quantidade = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

  return (
    <div className="produto-card fade-in">
      <div className="produto-emoji">{produto.emoji || '🍽️'}</div>
      
      <div className="produto-info">
        <h3 className="produto-nome">{produto.nome}</h3>
        {produto.descricao && (
          <p className="produto-descricao">{produto.descricao}</p>
        )}
        <p className="produto-preco">
          {Number(produto.preco).toFixed(2).replace('.', ',')} MT
        </p>
      </div>

      <div className="produto-acoes">
        {quantidade === 0 ? (
          <button
            className="btn btn-primary btn-adicionar"
            onClick={() => adicionarItem(produto)}
          >
            Adicionar
          </button>
        ) : (
          <div className="quantidade-controls">
            <button
              className="btn-quantidade"
              onClick={() => removerItem(produto.id)}
            >
              −
            </button>
            <span className="quantidade-display">{quantidade}</span>
            <button
              className="btn-quantidade"
              onClick={() => adicionarItem(produto)}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProdutoCard;
