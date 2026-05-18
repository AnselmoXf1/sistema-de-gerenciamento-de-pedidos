/**
 * Toca som de notificação
 */
export function tocarNotificacao() {
  try {
    // Criar AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Criar oscilador (gera o som)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configurar som (frequência e tipo)
    oscillator.frequency.value = 800; // Hz
    oscillator.type = 'sine';
    
    // Volume
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    // Tocar
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    console.log('🔔 Notificação tocada');
  } catch (error) {
    console.error('Erro ao tocar notificação:', error);
  }
}

/**
 * Toca som de sucesso
 */
export function tocarSucesso() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Erro ao tocar sucesso:', error);
  }
}

/**
 * Solicita permissão para notificações
 */
export async function solicitarPermissaoNotificacao() {
  if (!('Notification' in window)) {
    console.log('Browser não suporta notificações');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

/**
 * Mostra notificação do browser
 */
export function mostrarNotificacao(titulo, opcoes = {}) {
  if (Notification.permission === 'granted') {
    new Notification(titulo, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...opcoes
    });
  }
}
