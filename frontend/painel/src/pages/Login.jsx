import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !senha) {
      setErro('Preenche todos os campos');
      return;
    }
    
    try {
      setLoading(true);
      setErro(null);
      
      await login(email, senha);
      navigate('/', { replace: true });
      
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">🍔</div>
            <h1>Lanchonete da Fátima</h1>
            <p>Painel de Gestão</p>
          </div>

          {erro && <div className="error-message">{erro}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lanchonete.mz"
                disabled={loading}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha:</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? '⏳ A entrar...' : '🔐 Entrar'}
            </button>
          </form>

          <div className="login-footer">
            <p>Credenciais padrão:</p>
            <small>admin@lanchonete.mz / admin123</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
