const express = require('express');
const router = express.Router();
const prisma = require('../config/database');

/**
 * GET /api/cardapio
 * Lista todos os produtos disponíveis
 * Público - sem autenticação
 */
router.get('/', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        disponivel: true
      },
      orderBy: [
        { categoria: 'asc' },
        { ordem: 'asc' },
        { nome: 'asc' }
      ],
      select: {
        id: true,
        nome: true,
        descricao: true,
        preco: true,
        categoria: true,
        emoji: true,
        imagemUrl: true
      }
    });
    
    // Agrupar por categoria
    const porCategoria = produtos.reduce((acc, produto) => {
      const cat = produto.categoria || 'outros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(produto);
      return acc;
    }, {});
    
    res.json({
      produtos,
      porCategoria,
      total: produtos.length
    });
    
  } catch (erro) {
    console.error('Erro ao buscar cardápio:', erro);
    res.status(500).json({ erro: 'Erro ao carregar cardápio' });
  }
});

/**
 * GET /api/cardapio/:id
 * Busca produto específico
 */
router.get('/:id', async (req, res) => {
  try {
    const produto = await prisma.produto.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    
    res.json(produto);
    
  } catch (erro) {
    console.error('Erro ao buscar produto:', erro);
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  }
});

module.exports = router;
