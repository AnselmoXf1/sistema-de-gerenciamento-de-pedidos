import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Layout.css';

function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();

  function handleLogout() {
    if (confirm('Tens a certeza que queres sair?')) {
      logout();
      navigate('/login');
    }
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="header-left">
          <h1 className="logo">🍔 Lanchonete da Fátima</h1>
        </div>
        
        <nav className="header-nav">
          <button
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            📋 Fila
          </button>
          
          <button
            className={`nav-link ${location.pathname === '/gerar-link' ? 'active' : ''}`}
            onClick={() => navigate('/gerar-link')}
          >
            🔗 Gerar Link
          </button>
          
          <button
            className={`nav-link ${location.pathname === '/historico' ? 'active' : ''}`}
            onClick={() => navigate('/historico')}
          >
            📚 Histórico
          </button>
          
          <button
            className={`nav-link ${location.pathname === '/relatorios' ? 'active' : ''}`}
            onClick={() => navigate('/relatorios')}
          >
            📊 Relatórios
          </button>
        </nav>

        <div className="header-right">
          <div className="user-info">
            <span className="user-name">👤 {usuario?.nome}</span>
            <span className="user-role">{usuario?.role}</span>
          </div>
          
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            🚪 Sair
          </button>
        </div>
      </header>

      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}

export default Layout;
