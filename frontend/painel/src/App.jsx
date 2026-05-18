import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Fila from './pages/Fila';
import Historico from './pages/Historico';
import Relatorios from './pages/Relatorios';
import GerarLink from './pages/GerarLink';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Fila />
            </ProtectedRoute>
          } />
          
          <Route path="/gerar-link" element={
            <ProtectedRoute>
              <GerarLink />
            </ProtectedRoute>
          } />
          
          <Route path="/historico" element={
            <ProtectedRoute>
              <Historico />
            </ProtectedRoute>
          } />
          
          <Route path="/relatorios" element={
            <ProtectedRoute>
              <Relatorios />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
