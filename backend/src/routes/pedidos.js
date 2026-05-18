const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { limiterPedidos } = require('../middleware/rateLimit');
const { criarPedido } = require('../services/pedido');
const { notificarPedidoRecebido } = require('../services/sms');
const { validarTelefoneMZ, normalizarTelefone, validarFormaPagamento } = require('../utils/helpers');

/**
 * POST /api/pedidos
 * Cria um novo pedido
 * Público - sem autenticação
 */
router.post('/', limiterPedidos, async (req, res) => {
  try {
    const { mesaId, itens, formaPagamento, smsOptIn, telefoneSms, observacoes } = req.body;
    
    // Validações
    if (!mesaId || !itens || itens.length === 0) {
      return res.status(400).json({ 
        erro: 'Mesa e itens são obrigatórios' 
      });
    }
    
    if (!formaPagamento || !validarFormaPagamento(formaPagamento)) {
      return res.status(400).json({ 
        erro: 'Forma de pagamento inválida. Use: mpesa, emola ou dinheiro' 
      });
    }
    
    // Validar telefone se SMS opt-in
    if (smsOptIn) {
      if (!telefoneSms) {
        return res.status(400).json({ 
          erro: 'Número de telefone obrigatório para receber SMS' 
        });
      }
      
      if (!validarTelefoneMZ(telefoneSms)) {
        return res.status(400).json({ 
          erro: 'Número de telefone inválido. Use formato: +258XXXXXXXXX ou 8XXXXXXXX' 
        });
      }
    }
    
    // Normalizar telefone
    const telefoneNormalizado = smsOptIn ? normalizarTelefone(telefoneSms) : null;
    
    // Criar pedido
    const pedido = await criarPedido({
      mesaId: parseInt(mesaId),
      itens,
      formaPagamento,
      smsOptIn: smsOptIn || false,
      telefoneSms: telefoneNormalizado,
      observacoes
    });
    
    // Notificar painel em tempo real via Socket.io
    const io = req.app.get('io');
    io.to('painel').emit('novo-pedido', pedido);
    
    // Enviar SMS de confirmação (opcional)
    if (smsOptIn && telefoneNormalizado) {
      await notificarPedidoRecebido(pedido);
    }
    
    res.status(201).json({
      sucesso: true,
      pedido: {
        id: pedido.id,
        ticketNum: pedido.ticketNum,
        totalMt: pedido.totalMt,
        status: pedido.status,
        mesaNumero: pedido.mesa.numero
      },
      mensagem: `Pedido ${pedido.ticketNum} criado com sucesso!`
    });
    
  } catch (erro) {
    console.error('Erro ao criar pedido:', erro);
    res.status(500).json({ 
      erro: erro.message || 'Erro ao criar pedido' 
    });
  }
});

/**
 * GET /api/pedidos/:ticketNum
 * Busca pedido pelo número do ticket
 * Público - para o cliente acompanhar
 */
router.get('/:ticketNum', async (req, res) => {
  try {
    const pedido = await prisma.pedido.findUnique({
      where: { ticketNum: req.params.ticketNum },
      include: {
        itens: {
          include: {
            produto: true
          }
        },
        mesa: true
      }
    });
    
    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }
    
    // Não expor dados sensíveis
    const pedidoPublico = {
      ticketNum: pedido.ticketNum,
      status: pedido.status,
      totalMt: pedido.totalMt,
      mesaNumero: pedido.mesa.numero,
      criadoEm: pedido.criadoEm,
      itens: pedido.itens.map(item => ({
        produto: item.produto.nome,
        quantidade: item.quantidade,
        subtotal: item.subtotal
      }))
    };
    
    res.json(pedidoPublico);
    
  } catch (erro) {
    console.error('Erro ao buscar pedido:', erro);
    res.status(500).json({ erro: 'Erro ao buscar pedido' });
  }
});

/**
 * GET /api/mesa/:id/validar
 * Valida se a mesa existe e está activa
 */
router.get('/mesa/:id/validar', async (req, res) => {
  try {
    const { token } = req.query;
    
    const mesa = await prisma.mesa.findFirst({
      where: {
        id: parseInt(req.params.id),
        qrToken: token
      }
    });
    
    if (!mesa) {
      return res.status(404).json({ 
        valida: false, 
        erro: 'Mesa não encontrada ou token inválido' 
      });
    }
    
    if (!mesa.activa) {
      return res.status(403).json({ 
        valida: false, 
        erro: 'Mesa inactiva' 
      });
    }
    
    res.json({
      valida: true,
      mesa: {
        id: mesa.id,
        numero: mesa.numero
      }
    });
    
  } catch (erro) {
    console.error('Erro ao validar mesa:', erro);
    res.status(500).json({ erro: 'Erro ao validar mesa' });
  }
});

module.exports = router;
