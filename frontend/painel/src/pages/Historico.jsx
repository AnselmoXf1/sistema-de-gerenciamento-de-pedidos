import { useState, useEffect } from 'react';
import { buscarHistorico } from '../services/api';
import Layout from '../components/Layout';
import '../styles/Historico.css';

function Historico() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtros, setFiltros] = useState({
    dataInicio: new Date().toISOString().split('T')[0],
    dataFim: '',
    status: ''
  });

  useEffect(() => {
    carregarHistorico();
  }, []);

  async function carregarHistorico() {
    try {
      setLoading(true);
      setErro(null);
      
      const dados = await buscarHistorico(filtros);
      setPedidos(dados.pedidos);
      
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFiltrar(e) {
    e.preventDefault();
    carregarHistorico();
  }

  const totalFacturacao = pedidos
    .filter(p => p.status === 'entregue')
    .reduce((total, p) => total + Number(p.totalMt), 0);

  return (
    <Layout>
      <div className="historico-page">
        <div className="page-header">
          <h1>📚 Histórico de Pedidos</h1>
        </div>

        <div className="filtros-card">
          <form onSubmit={handleFiltrar} className="filtros-form">
            <div className="form-row">
              <div className="form-group">
                <label>Data Início:</label>
                <input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Data Fim:</label>
                <input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Status:</label>
                <select
                  value={filtros.status}
                  onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
                >
                  <option value="">Todos</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary">
                🔍 Filtrar
              </button>
            </div>
          </form>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        <div className="resumo-cards">
          <div className="resumo-card">
            <div className="resumo-icon">📋</div>
            <div className="resumo-info">
              <span className="resumo-label">Total de Pedidos</span>
              <span className="resumo-valor">{pedidos.length}</span>
            </div>
          </div>

          <div className="resumo-card">
            <div className="resumo-icon">✅</div>
            <div className="resumo-info">
              <span className="resumo-label">Entregues</span>
              <span className="resumo-valor">
                {pedidos.filter(p => p.status === 'entregue').length}
              </span>
            </div>
          </div>

          <div className="resumo-card">
            <div className="resumo-icon">💰</div>
            <div className="resumo-info">
              <span className="resumo-label">Facturação</span>
              <span className="resumo-valor">
                {totalFacturacao.toFixed(2).replace('.', ',')} MT
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>A carregar histórico...</p>
          </div>
        ) : (
          <div className="historico-table-container">
            <table className="historico-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Mesa</th>
                  <th>Data/Hora</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Pagamento</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      Nenhum pedido encontrado
                    </td>
                  </tr>
                ) : (
                  pedidos.map(pedido => (
                    <tr key={pedido.id}>
                      <td className="ticket-cell">#{pedido.ticketNum}</td>
                      <td>Mesa {pedido.mesa.numero}</td>
                      <td>
                        {new Date(pedido.criadoEm).toLocaleString('pt-PT', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td>{pedido.itens.length} itens</td>
                      <td className="valor-cell">
                        {Number(pedido.totalMt).toFixed(2).replace('.', ',')} MT
                      </td>
                      <td>
                        {pedido.formaPagamento === 'mpesa' && '📱 M-Pesa'}
                        {pedido.formaPagamento === 'emola' && '💰 e-Mola'}
                        {pedido.formaPagamento === 'dinheiro' && '💵 Dinheiro'}
                      </td>
                      <td>
                        <span className={`status-badge status-${pedido.status}`}>
                          {pedido.status === 'entregue' && '✅ Entregue'}
                          {pedido.status === 'cancelado' && '❌ Cancelado'}
                          {pedido.status === 'pronto' && '✅ Pronto'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Historico;
