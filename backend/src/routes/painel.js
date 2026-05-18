const express = require('express');
const router = express.Router();
const { autenticar } = require('../middleware/auth');
const { limiterSms } = require('../middleware/rateLimit');
const { 
  buscarPedidosActivos, 
  actualizarStatus, 
  buscarHistorico,
  gerarRelatorioDia,
  mascararDadosSensiveis 
} = require('../services/pedido');
const { notificarPedidoPronto, enviarSms } = require('../services/sms');

/**
 * GET /api/painel/pedidos
 * Lista pedidos activos (aguardando, em preparo, pronto)
 * Requer autenticação
 */
router.get('/pedidos', autenticar, async (req, res) => {
  try {
    const pedidos = await buscarPedidosActivos();
    
    // Mascarar dados sensíveis
    const pedidosMascarados = pedidos.map(mascararDadosSensiveis);
    
    res.json({
      pedidos: pedidosMascarados,
      total: pedidosMascarados.length
    });
    
  } catch (erro) {
    console.error('Erro ao buscar pedidos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar pedidos' });
  }
});

/**
 * PATCH /api/painel/pedidos/:id
 * Actualiza status do pedido
 * Requer autenticação
 */
router.patch('/pedidos/:id', autenticar, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ erro: 'Status é obrigatório' });
    }
    
    const pedido = await actualizarStatus(parseInt(req.params.id), status);
    
    // Se mudou para "pronto", enviar SMS automaticamente
    if (status === 'pronto') {
      await notificarPedidoPronto(pedido);
    }
    
    // Notificar painel em tempo real
    const io = req.app.get('io');
    io.to('painel').emit('pedido-actualizado', pedido);
    
    res.json({
      sucesso: true,
      pedido: mascararDadosSensiveis(pedido),
      mensagem: `Pedido actualizado para: ${status}`
    });
    
  } catch (erro) {
    console.error('Erro ao actualizar pedido:', erro);
    res.status(500).json({ erro: erro.message || 'Erro ao actualizar pedido' });
  }
});

/**
 * POST /api/painel/pedidos/:id/notificar
 * Envia SMS manual para o cliente
 * Requer autenticação
 */
router.post('/pedidos/:id/notificar', autenticar, limiterSms, async (req, res) => {
  try {
    const prisma = require('../config/database');
    
    const pedido = await prisma.pedido.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!pedido) {
      return res.status(404).json({ erro: 'Pedido não encontrado' });
    }
    
    const resultado = await notificarPedidoPronto(pedido);
    
    if (resultado.sucesso) {
      res.json({
        sucesso: true,
        mensagem: 'SMS enviado com sucesso'
      });
    } else {
      res.status(400).json({
        sucesso: false,
        erro: resultado.motivo || 'Não foi possível enviar SMS'
      });
    }
    
  } catch (erro) {
    console.error('Erro ao enviar SMS:', erro);
    res.status(500).json({ erro: 'Erro ao enviar SMS' });
  }
});

/**
 * GET /api/painel/historico
 * Busca histórico de pedidos
 * Requer autenticação
 */
router.get('/historico', autenticar, async (req, res) => {
  try {
    const { dataInicio, dataFim, status } = req.query;
    
    const pedidos = await buscarHistorico({
      dataInicio,
      dataFim,
      status
    });
    
    res.json({
      pedidos: pedidos.map(mascararDadosSensiveis),
      total: pedidos.length
    });
    
  } catch (erro) {
    console.error('Erro ao buscar histórico:', erro);
    res.status(500).json({ erro: 'Erro ao buscar histórico' });
  }
});

/**
 * GET /api/painel/relatorios/dia
 * Gera relatório do dia
 * Requer autenticação
 */
router.get('/relatorios/dia', autenticar, async (req, res) => {
  try {
    const { data } = req.query;
    const dataRelatorio = data ? new Date(data) : new Date();
    
    const relatorio = await gerarRelatorioDia(dataRelatorio);
    
    res.json(relatorio);
    
  } catch (erro) {
    console.error('Erro ao gerar relatório:', erro);
    res.status(500).json({ erro: 'Erro ao gerar relatório' });
  }
});

module.exports = router;
