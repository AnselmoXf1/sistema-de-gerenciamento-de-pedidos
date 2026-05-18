import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import '../styles/QRScanner.css';

function QRScanner({ onScanSuccess, onScanError }) {
  const scannerRef = useRef(null);
  const [permissaoNegada, setPermissaoNegada] = useState(false);
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        showTorchButtonIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText, decodedResult) => {
        console.log('QR Code detectado:', decodedText);
        html5QrcodeScanner.clear();
        if (onScanSuccess) {
          onScanSuccess(decodedText, decodedResult);
        }
      },
      (errorMessage) => {
        // Ignorar erros de scan contínuo
        if (errorMessage.includes('NotFoundException')) {
          return;
        }
        
        // Detectar permissão negada
        if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowedError')) {
          setPermissaoNegada(true);
          if (onScanError) {
            onScanError('Permissão de câmera negada');
          }
        }
      }
    );

    setScanner(html5QrcodeScanner);

    return () => {
      html5QrcodeScanner.clear().catch(err => {
        console.log('Erro ao limpar scanner:', err);
      });
    };
  }, [onScanSuccess, onScanError]);

  const solicitarPermissao = async () => {
    try {
      setPermissaoNegada(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      window.location.reload();
    } catch (err) {
      console.error('Erro ao solicitar permissão:', err);
      setPermissaoNegada(true);
      if (onScanError) {
        onScanError('Não foi possível acessar a câmera');
      }
    }
  };

  return (
    <div className="qr-scanner-container">
      <div id="qr-reader" ref={scannerRef}></div>
      
      {permissaoNegada && (
        <div className="permissao-negada">
          <div className="permissao-card">
            <h3>📷 Permissão de Câmera Necessária</h3>
            <p>Para escanear o QR code da mesa, precisamos acessar sua câmera.</p>
            <button className="btn btn-primary" onClick={solicitarPermissao}>
              Permitir Acesso à Câmera
            </button>
            <div className="instrucoes">
              <p><strong>Como permitir:</strong></p>
              <ol>
                <li>Clique no ícone de cadeado/câmera na barra de endereço</li>
                <li>Selecione "Permitir" para câmera</li>
                <li>Recarregue a página</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRScanner;
