import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar token do localStorage
    const tokenSalvo = localStorage.getItem('token');
    const usuarioSalvo = localStorage.getItem('usuario');
    
    if (tokenSalvo && usuarioSalvo) {
      setToken(tokenSalvo);
      setUsuario(JSON.parse(usuarioSalvo));
    }
    
    setLoading(false);
  }, []);

  async function login(email, senha) {
    const resultado = await apiLogin(email, senha);
    
    setToken(resultado.token);
    setUsuario(resultado.usuario);
    
    localStorage.setItem('token', resultado.token);
    localStorage.setItem('usuario', JSON.stringify(resultado.usuario));
    
    return resultado;
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }

  const value = {
    usuario,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
