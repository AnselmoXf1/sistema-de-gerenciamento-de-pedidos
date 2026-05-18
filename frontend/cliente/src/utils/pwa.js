/**
 * Utilitários PWA
 */

/**
 * Registra o Service Worker
 */
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registado:', registration.scope);
          
          // Verificar actualizações
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nova versão disponível
                console.log('🔄 Nova versão disponível');
                
                // Notificar usuário (opcional)
                if (confirm('Nova versão disponível! Actualizar agora?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ Erro ao registar Service Worker:', error);
        });
    });
  }
}

/**
 * Verifica se está online
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Adiciona listeners de conexão
 */
export function setupConnectionListeners(onOnline, onOffline) {
  window.addEventListener('online', () => {
    console.log('✅ Conexão restaurada');
    if (onOnline) onOnline();
  });
  
  window.addEventListener('offline', () => {
    console.log('⚠️ Sem conexão');
    if (onOffline) onOffline();
  });
}

/**
 * Verifica se pode instalar PWA
 */
export function canInstallPWA() {
  return window.matchMedia('(display-mode: standalone)').matches === false;
}

/**
 * Prompt para instalar PWA
 */
let deferredPrompt = null;

export function setupInstallPrompt(onInstallable) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    console.log('📱 PWA pode ser instalado');
    if (onInstallable) onInstallable();
  });
}

export async function promptInstall() {
  if (!deferredPrompt) {
    console.log('⚠️ Prompt de instalação não disponível');
    return false;
  }
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} instalar`);
  deferredPrompt = null;
  
  return outcome === 'accepted';
}

/**
 * Detecta se está rodando como PWA
 */
export function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

/**
 * Informações de conexão (experimental)
 */
export function getConnectionInfo() {
  const connection = navigator.connection || 
                     navigator.mozConnection || 
                     navigator.webkitConnection;
  
  if (!connection) {
    return { type: 'unknown', effectiveType: 'unknown' };
  }
  
  return {
    type: connection.type,
    effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
    downlink: connection.downlink, // Mbps
    rtt: connection.rtt, // ms
    saveData: connection.saveData // boolean
  };
}

/**
 * Verifica se é conexão lenta
 */
export function isSlowConnection() {
  const info = getConnectionInfo();
  return info.effectiveType === '2g' || 
         info.effectiveType === 'slow-2g' ||
         info.saveData === true;
}
