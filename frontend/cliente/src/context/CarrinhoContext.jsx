import { createContext, useContext, useState, useEffect } from 'react';

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState([]);
  const [mesaId, setMesaId] = useState(null);
  const [mesaNumero, setMesaNumero] = useState(null);

  // Carregar carrinho do localStorage
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, []);

  // Salvar carrinho no localStorage
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

  const adicionarItem = (produto) => {
    setCarrinho(prev => {
      const itemExiste = prev.find(item => item.id === produto.id);
      
      if (itemExiste) {
        return prev.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removerItem = (produtoId) => {
    setCarrinho(prev => {
      const item = prev.find(item => item.id === produtoId);
      
      if (item && item.quantidade > 1) {
        return prev.map(item =>
          item.id === produtoId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        );
      }
      
      return prev.filter(item => item.id !== produtoId);
    });
  };

  const limparCarrinho = () => {
    setCarrinho([]);
    localStorage.removeItem('carrinho');
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      return total + (Number(item.preco) * item.quantidade);
    }, 0);
  };

  const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);

  return (
    <CarrinhoContext.Provider value={{
      carrinho,
      mesaId,
      mesaNumero,
      setMesaId,
      setMesaNumero,
      adicionarItem,
      removerItem,
      limparCarrinho,
      calcularTotal,
      totalItens
    }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider');
  }
  return context;
}
