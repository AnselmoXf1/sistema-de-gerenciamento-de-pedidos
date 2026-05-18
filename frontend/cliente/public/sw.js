// Service Worker para PWA - Cache First Strategy
const CACHE_NAME = 'lanchonete-v1';
const RUNTIME_CACHE = 'lanchonete-runtime';

// Recursos para cache inicial
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/styles/global.css'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache aberto');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[SW] Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estratégia: Network First para API, Cache First para assets
  if (url.pathname.startsWith('/api/')) {
    // API: Network First (sempre tenta rede primeiro)
    event.respondWith(networkFirst(request));
  } else {
    // Assets: Cache First (usa cache se disponível)
    event.respondWith(cacheFirst(request));
  }
});

// Estratégia Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    console.log('[SW] Servindo do cache:', request.url);
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    // Cachear apenas respostas válidas
    if (response && response.status === 200) {
      const responseClone = response.clone();
      cache.put(request, responseClone);
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Erro ao buscar:', error);
    
    // Retornar página offline se disponível
    return cache.match('/offline.html') || new Response('Sem conexão', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Estratégia Network First
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    
    // Cachear resposta da API
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.log('[SW] Rede falhou, tentando cache:', request.url);
    
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
