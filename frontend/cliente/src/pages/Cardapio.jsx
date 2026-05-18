import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useCarrinho } from '../context/CarrinhoContext';
import { validarMesa, buscarCardapio } from '../services/api';
import ProdutoCard from '../components/ProdutoCard';
import CarrinhoBar from '../components/CarrinhoBar';
import '../styles/Cardapio.css';

function Cardapio() {
  const { mesaId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setMesaId, setMesaNumero } = useCarrinho();
  
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  useEffect(() => {
    carregarDados();
  }, [mesaId]);

  async function carregarDados() {
    try {
      setLoading(true);
      setErro(null);
      
      // Validar mesa
      const token = searchParams.get('token');
      if (!token) {
        throw new Error('Token da mesa não fornecido');
      }
      
      const mesaValida = await validarMesa(mesaId, token);
      
      if (!mesaValida.valida) {
        throw new Error(mesaValida.erro || 'Mesa inválida');
      }
      
      setMesaId(mesaValida.mesa.id);
      setMesaNumero(mesaValida.mesa.numero);
      
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
    <div className="cardapio-page">
      <header className="cardapio-header">
        <h1>🍔 Lanchonete da Fátima</h1>
        <p className="mesa-info">Mesa {setMesaNumero || mesaId}</p>
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

export default Cardapio;
