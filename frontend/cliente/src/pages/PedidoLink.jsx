import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import { buscarCardapio } from '../services/api';
import ProdutoCard from '../components/ProdutoCard';
import CarrinhoBar from '../components/CarrinhoBar';
import '../styles/PedidoLink.css';

function PedidoLink() {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { setMesaId, setMesaNumero } = useCarrinho();
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [tipoLink, setTipoLink] = useState('');

  useEffect(() => {
    carregarDados();
  }, [linkId]);

  async function carregarDados() {
    try {
      setLoading(true);
      setErro(null);
      
      // Extrair tipo do link
      const tipo = linkId.split('-')[0];
      setTipoLink(tipo);
      
      // Configurar mesa virtual para o link
      // Usar ID negativo para diferenciar de mesas físicas
      const mesaVirtualId = -Math.abs(linkId.split('-')[1]);
      setMesaId(mesaVirtualId);
      
      // Definir número da mesa baseado no tipo
      let mesaNumero = '';
      if (tipo === 'delivery') {
        mesaNumero = 'Delivery';
      } else if (tipo === 'takeaway') {
        mesaNumero = 'Takeaway';
      } else if (tipo === 'mesa_virtual') {
        mesaNumero = 'Mesa Virtual';
      } else {
        mesaNumero = 'Online';
      }
      setMesaNumero(mesaNumero);
      
      // Buscar cardápio
      const cardapio = await buscarCardapio();
      setProdutos(cardapio.produtos);
      setCategorias(cardapio.porCategoria);
      
    } catch (err) {
      console.error('Erro ao carregar:', err);
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  const produtosFiltrados = categoriaActiva === 'todos'
    ? produtos
    : produtos.filter(p => p.categoria === categoriaActiva);

  const getTipoIcon = () => {
    switch(tipoLink) {
      case 'delivery': return '🛵';
      case 'takeaway': return '🥡';
      case 'mesa_virtual': return '🪑';
      default: return '🍔';
    }
  };

  const getTipoNome = () => {
    switch(tipoLink) {
      case 'delivery': return 'Delivery';
      case 'takeaway': return 'Takeaway';
      case 'mesa_virtual': return 'Mesa Virtual';
      default: return 'Pedido Online';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>🔄 A carregar cardápio...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="container" style={{ padding: '20px' }}>
        <div className="error">{erro}</div>
        <button className="btn btn-primary" onClick={carregarDados}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="pedido-link-page">
      <header className="pedido-link-header">
        <h1>🍔 Lanchonete da Fátima</h1>
        <div className="tipo-pedido-badge">
          <span className="tipo-icon">{getTipoIcon()}</span>
          <span className="tipo-nome">{getTipoNome()}</span>
        </div>
        
        {tipoLink === 'delivery' && (
          <p className="info-tipo">📍 Entregaremos no seu endereço</p>
        )}
        {tipoLink === 'takeaway' && (
          <p className="info-tipo">🏪 Levante no balcão quando estiver pronto</p>
        )}
      </header>

      <div className="categorias-tabs">
        <button
          className={`categoria-tab ${categoriaActiva === 'todos' ? 'activa' : ''}`}
          onClick={() => setCategoriaActiva('todos')}
        >
          Todos
        </button>
        {Object.keys(categorias).map(cat => (
          <button
            key={cat}
            className={`categoria-tab ${categoriaActiva === cat ? 'activa' : ''}`}
            onClick={() => setCategoriaActiva(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="produtos-grid">
        {produtosFiltrados.map(produto => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>

      {produtosFiltrados.length === 0 && (
        <div className="empty-state">
          <p>Nenhum produto nesta categoria</p>
        </div>
      )}

      <CarrinhoBar />
    </div>
  );
}

export default PedidoLink;
