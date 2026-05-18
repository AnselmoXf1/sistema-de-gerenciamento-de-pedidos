const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona os dados do usuário ao req
 */
function autenticar(req, res, next) {
  try {
    // Obter token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }
    
    // Formato esperado: "Bearer TOKEN"
    const parts = authHeader.split(' ');
    
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ erro: 'Formato de token inválido' });
    }
    
    const token = parts[1];
    
    // Verificar token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
      }
      
      // Adicionar dados do usuário ao request
      req.usuario = decoded;
      next();
    });
    
  } catch (erro) {
    console.error('Erro na autenticação:', erro);
    return res.status(500).json({ erro: 'Erro ao verificar autenticação' });
  }
}

/**
 * Middleware para verificar role específica
 */
function verificarRole(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }
    
    if (!rolesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({ erro: 'Sem permissão para esta acção' });
    }
    
    next();
  };
}

module.exports = { autenticar, verificarRole };
