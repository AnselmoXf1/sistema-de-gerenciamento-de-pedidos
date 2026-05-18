const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { limiterLogin } = require('../middleware/rateLimit');

/**
 * POST /api/auth/login
 * Login da dona/funcionária
 */
router.post('/login', limiterLogin, async (req, res) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
    }
    
    // Buscar usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });
    
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }
    
    if (!usuario.activo) {
      return res.status(403).json({ erro: 'Usuário inactivo' });
    }
    
    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );
    
    console.log(`✅ Login bem-sucedido: ${usuario.email}`);
    
    res.json({
      sucesso: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
    
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ erro: 'Erro ao fazer login' });
  }
});

/**
 * POST /api/auth/registar
 * Registar novo usuário (apenas para desenvolvimento)
 * Em produção, remover ou proteger esta rota
 */
router.post('/registar', async (req, res) => {
  try {
    // Apenas permitir em desenvolvimento
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ erro: 'Registo desactivado em produção' });
    }
    
    const { nome, email, senha, role } = req.body;
    
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
    }
    
    // Verificar se email já existe
    const existe = await prisma.usuario.findUnique({
      where: { email }
    });
    
    if (existe) {
      return res.status(400).json({ erro: 'Email já registado' });
    }
    
    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);
    
    // Criar usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        role: role || 'funcionaria'
      }
    });
    
    console.log(`✅ Usuário registado: ${usuario.email}`);
    
    res.status(201).json({
      sucesso: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });
    
  } catch (erro) {
    console.error('Erro ao registar:', erro);
    res.status(500).json({ erro: 'Erro ao registar usuário' });
  }
});

module.exports = router;
