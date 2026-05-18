import { useState, useEffect } from 'react';
import { buscarRelatorioDia } from '../services/api';
import Layout from '../components/Layout';
import '../styles/Relatorios.css';

function Relatorios() {
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    carregarRelatorio();
  }, []);

  async function carregarRelatorio() {
    try {
      setLoading(true);
      setErro(null);
      
      const dados = await buscarRelatorioDia(data);
      setRelatorio(dados);
      
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleBuscar(e) {
    e.preventDefault();
    carregarRelatorio();
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>A carregar relatório...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relatorios-page">
        <div className="page-header">
          <h1>📊 Relatórios</h1>
        </div>

        <div className="filtro-data-card">
          <form onSubmit={handleBuscar} className="filtro-data-form">
            <label>Seleccionar Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <button type="submit" className="btn btn-primary">
              📅 Buscar
            </button>
          </form>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        {relatorio && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <span className="stat-label">Total de Pedidos</span>
                  <span className="stat-value">{relatorio.totalPedidos}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <span className="stat-label">Pedidos Entregues</span>
                  <span className="stat-value">{relatorio.pedidosEntregues}</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <span className="stat-label">Pedidos Cancelados</span>
                  <span className="stat-value">{relatorio.pedidosCancelados}</span>
                </div>
              </div>

              <div className="stat-card highlight">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <span className="stat-label">Facturação Total</span>
                  <span className="stat-value">
                    {Number(relatorio.facturacao).toFixed(2).replace('.', ',')} MT
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <div className="stat-content">
                  <span className="stat-label">Ticket Médio</span>
                  <span className="stat-value">
                    {Number(relatorio.ticketMedio).toFixed(2).replace('.', ',')} MT
                  </span>
                </div>
              </div>
            </div>

            <div className="pagamentos-card">
              <h2>💳 Facturação por Forma de Pagamento</h2>
              
              <div className="pagamentos-lista">
                {Object.entries(relatorio.porFormaPagamento).map(([forma, valor]) => (
                  <div key={forma} className="pagamento-item">
                    <div className="pagamento-info">
                      <span className="pagamento-icon">
                        {forma === 'mpesa' && '📱'}
                        {forma === 'emola' && '💰'}
                        {forma === 'dinheiro' && '💵'}
                      </span>
                      <span className="pagamento-nome">
                        {forma === 'mpesa' && 'M-Pesa'}
                        {forma === 'emola' && 'e-Mola'}
                        {forma === 'dinheiro' && 'Dinheiro'}
                      </span>
                    </div>
                    
                    <span className="pagamento-valor">
                      {Number(valor).toFixed(2).replace('.', ',')} MT
                    </span>
                    
                    <div className="pagamento-barra">
                      <div 
                        className="pagamento-progresso"
                        style={{ 
                          width: `${(valor / relatorio.facturacao) * 100}%`,
                          background: forma === 'mpesa' ? '#10b981' : forma === 'emola' ? '#3b82f6' : '#6b7280'
                        }}
                      />
                    </div>
                    
                    <span className="pagamento-percentagem">
                      {((valor / relatorio.facturacao) * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export default Relatorios;
