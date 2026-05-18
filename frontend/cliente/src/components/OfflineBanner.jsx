import { useState, useEffect } from 'react';
import { isOnline, setupConnectionListeners } from '../utils/pwa';
import '../styles/OfflineBanner.css';

function OfflineBanner() {
  const [online, setOnline] = useState(isOnline());
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setupConnectionListeners(
      () => {
        setOnline(true);
        setShowBanner(true);
        
        // Esconder banner após 3 segundos
        setTimeout(() => setShowBanner(false), 3000);
      },
      () => {
        setOnline(false);
        setShowBanner(true);
      }
    );
  }, []);

  if (!showBanner) return null;

  return (
    <div className={`offline-banner ${online ? 'online' : 'offline'}`}>
      {online ? (
        <>
          <span className="banner-icon">✅</span>
          <span>Conexão restaurada</span>
        </>
      ) : (
        <>
          <span className="banner-icon">⚠️</span>
          <span>Sem conexão à internet</span>
        </>
      )}
    </div>
  );
}

export default OfflineBanner;
