import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cardapio from './pages/Cardapio';
import PedidoLink from './pages/PedidoLink';
import Resumo from './pages/Resumo';
import Confirmacao from './pages/Confirmacao';
import AcompanharPedido from './pages/AcompanharPedido';
import { CarrinhoProvider } from './context/CarrinhoContext';
import OfflineBanner from './components/OfflineBanner';

function App() {
  return (
    <BrowserRouter>
      <CarrinhoProvider>
        <OfflineBanner />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mesa/:mesaId" element={<Cardapio />} />
          <Route path="/link/:linkId" element={<PedidoLink />} />
          <Route path="/resumo" element={<Resumo />} />
          <Route path="/confirmacao/:ticketNum" element={<Confirmacao />} />
          <Route path="/pedido/:ticketNum" element={<AcompanharPedido />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </CarrinhoProvider>
    </BrowserRouter>
  );
}

export default App;
