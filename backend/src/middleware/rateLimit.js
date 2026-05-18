const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para criação de pedidos
 * Previne spam e abuso
 */
const limiterPedidos = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 pedidos por IP por hora
  message: {
    erro: 'Demasiados pedidos. Tente novamente mais tarde.',
    tentarNovamenteEm: '1 hora'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para login
 * Previne ataques de força bruta
 */
const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: {
    erro: 'Demasiadas tentativas de login. Tente novamente mais tarde.',
    tentarNovamenteEm: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter para SMS
 * Previne envio excessivo de SMS
 */
const limiterSms = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 3, // máximo 3 SMS por minuto
  message: {
    erro: 'Demasiados SMS enviados. Aguarde um momento.',
    tentarNovamenteEm: '1 minuto'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  limiterPedidos,
  limiterLogin,
  limiterSms
};
