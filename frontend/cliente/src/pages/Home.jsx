import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [escaneando, setEscaneando] = useState(false);
  const [erro, setErro] = useState(null);
  const [numeroMesa, setNumeroMesa] = useState('');
  const [usarCodigo, setUsarCodigo] = useState(false);

  const handleScanSuccess = (decodedText) => {
    console.log('QR Code escaneado:', decodedText);
    
    try {
      // Tentar extrair URL do QR code
      const url = new URL(decodedText);
      const pathname = url.pathname;
      const searchParams = url.search;
      
      // Verificar se é uma URL válida do sistema
      if (pathname.includes('/mesa/')) {
        // Navegar para a URL escaneada
        navigate(pathname + searchParams);
      } else {
        setErro('QR code inválido. Por favor, escaneie o QR code da mesa.');
        setEscaneando(false);
      }
    } catch (err) {
      console.error('Erro ao processar QR code:', err);
      setErro('QR code inválido. Por favor, escaneie o QR code da mesa.');
      setEscaneando(false);
    }
  };

  const handleScanError = (errorMessage) => {
    console.error('Erro no scanner:', errorMessage);
    
    // Se erro de HTTPS, sugerir usar código manual
    if (errorMessage.includes('https') || errorMessage.includes('secure')) {
      setErro('Câmera requer HTTPS. Use a opção "Digitar Código da Mesa" abaixo.');
      setEscaneando(false);
    } else {
      setErro(errorMessage);
    }
  };

  const iniciarScanner = () => {
    setErro(null);
    setEscaneando(true);
    setUsarCodigo(false);
  };

  const cancelarScanner = () => {
    setEscaneando(false);
    setErro(null);
  };

  const abrirDigitarCodigo = () => {
    setUsarCodigo(true);
    setEscaneando(false);
    setErro(null);
  };

  const handleSubmitCodigo = (e) => {
    e.preventDefault();
    
    if (!numeroMesa || numeroMesa.trim() === '') {
      setErro('Por favor, digite o número da mesa');
      return;
    }

    // Simular acesso direto à mesa
    // Em produção, você deve validar o código no backend
    const mesaId = parseInt(numeroMesa);
    
    if (isNaN(mesaId) || mesaId < 1) {
      setErro('Número de mesa inválido');
      return;
    }

    // Gerar token temporário (em produção, buscar do backend)
    const token = 'temp-' + Date.now();
    
    navigate(`/mesa/${mesaId}?token=${token}`);
  };

  const voltarInicio = () => {
    setUsarCodigo(false);
    setEscaneando(false);
    setErro(null);
    setNumeroMesa('');
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <header className="home-header">
          <div className="logo">🍔</div>
          <h1>Lanchonete da Fátima</h1>
          <p className="subtitle">Sistema de Pedidos Digital</p>
        </header>

        {!escaneando ? (
          <div className="home-content">
            <div className="welcome-card">
              <h2>Bem-vindo!</h2>
              <p>Para fazer seu pedido, escaneie o QR code da sua mesa.</p>
              
              <button className="btn btn-primary btn-large" onClick={iniciarScanner}>
                📷 Escanear QR Code
              </button>

              <div className="instrucoes-home">
                <h3>Como funciona:</h3>
                <ol>
                  <li>Clique no botão acima</li>
                  <li>Permita o acesso à câmera</li>
                  <li>Aponte para o QR code da mesa</li>
                  <li>Faça seu pedido!</li>
                </ol>
              </div>
            </div>

            {erro && (
              <div className="error-message">
                <p>⚠️ {erro}</p>
                <button className="btn btn-secondary" onClick={() => setErro(null)}>
                  OK
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="scanner-section">
            <div className="scanner-header">
              <h2>Escaneie o QR Code da Mesa</h2>
              <p>Posicione o QR code dentro da área marcada</p>
            </div>

            <QRScanner 
              onScanSuccess={handleScanSuccess}
              onScanError={handleScanError}
            />

            <button className="btn btn-secondary btn-cancelar" onClick={cancelarScanner}>
              Cancelar
            </button>

            {erro && (
              <div className="error-message">
                <p>⚠️ {erro}</p>
              </div>
            )}
          </div>
        )}

        <footer className="home-footer">
          <p>🕐 Horário de funcionamento: Seg-Sáb, 10h-22h</p>
          <p>📍 Maputo, Moçambique</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
