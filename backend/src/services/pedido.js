const prisma = require('../config/database');
const { gerarTicketNum, calcularTotal, mascaraTelefone } = require('../utils/helpers');

/**
 * Cria um novo pedido
 */
async function criarPedido(dados) {
  const { mesaId, itens, formaPagamento, smsOptIn, telefoneSms, observacoes } = dados;
  
  // Validar mesa
  const mesa = await prisma.mesa.findUnique({
    where: { id: mesaId }
  });
  
  if (!mesa || !mesa.activa) {
    throw new Error('Mesa inválida ou inactiva');
  }
  
  // Validar produtos e calcular total
  let totalMt = 0;
  const itensValidados = [];
  
  for (const item of itens) {
    const produto = await prisma.produto.findUnique({
      where: { id: item.produtoId }
    });
    
    if (!produto || !produto.disponivel) {
      throw new Error(`Produto ${item.produtoId} não disponível`);
    }
    
    const subtotal = produto.preco * item.quantidade;
    totalMt += subtotal;
    
    itensValidados.push({
      produtoId: produto.id,
      quantidade: item.quantidade,
      precoUnit: produto.preco,
      subtotal
    });
  }
  
  // Gerar número de ticket único
  let ticketNum;
  let tentativas = 0;
  
  do {
    ticketNum = gerarTicketNum();
    const existe = await prisma.pedido.findUnique({
      where: { ticketNum }
    });
    
    if (!existe) break;
    tentativas++;
  } while (tentativas < 10);
  
  if (tentativas >= 10) {
    throw new Error('Erro ao gerar número de ticket único');
  }
  
  // Criar pedido com itens
  const pedido = await prisma.pedido.create({
    data: {
      ticketNum,
      mesaId,
      formaPagamento,
      totalMt,
      smsOptIn: smsOptIn || false,
      telefoneSms: smsOptIn ? telefoneSms : null,
      observacoes,
      itens: {
        create: itensValidados
      }
    },
    include: {
      itens: {
        include: {
          produto: true
        }
      },
      mesa: true
    }
  });
  
  console.log(`✅ Pedido criado: ${ticketNum} - Mesa ${mesa.numero}`);
  
  return pedido;
}

/**
 * Busca pedidos activos (para o painel)
 */
async function buscarPedidosActivos() {
  return await prisma.pedido.findMany({
    where: {
      status: {
        in: ['aguardando', 'em_preparo', 'pronto']
      }
    },
    include: {
      itens: {
        include: {
          produto: true
        }
      },
      mesa: true
    },
    orderBy: {
      criadoEm: 'asc'
    }
  });
}

/**
 * Actualiza status do pedido
 */
async function actualizarStatus(pedidoId, novoStatus) {
  const statusValidos = ['aguardando', 'em_preparo', 'pronto', 'entregue', 'cancelado'];
  
  if (!statusValidos.includes(novoStatus)) {
    throw new Error('Status inválido');
  }
  
  const dados = { status: novoStatus };
  
  // Adicionar timestamps conforme o status
  if (novoStatus === 'em_preparo') {
    dados.confirmadoEm = new Date();
  } else if (novoStatus === 'pronto') {
    dados.prontoEm = new Date();
  } else if (novoStatus === 'entregue') {
    dados.entregueEm = new Date();
  }
  
  const pedido = await prisma.pedido.update({
    where: { id: pedidoId },
    data: dados,
    include: {
      itens: {
        include: {
          produto: true
        }
      },
      mesa: true
    }
  });
  
  console.log(`✅ Pedido ${pedido.ticketNum} actualizado para: ${novoStatus}`);
  
  return pedido;
}

/**
 * Busca histórico de pedidos
 */
async function buscarHistorico(filtros = {}) {
  const { dataInicio, dataFim, status } = filtros;
  
  const where = {};
  
  if (dataInicio || dataFim) {
    where.criadoEm = {};
    if (dataInicio) where.criadoEm.gte = new Date(dataInicio);
    if (dataFim) where.criadoEm.lte = new Date(dataFim);
  }
  
  if (status) {
    where.status = status;
  }
  
  return await prisma.pedido.findMany({
    where,
    include: {
      itens: {
        include: {
          produto: true
        }
      },
      mesa: true
    },
    orderBy: {
      criadoEm: 'desc'
    }
  });
}

/**
 * Gera relatório do dia
 */
async function gerarRelatorioDia(data = new Date()) {
  const inicioDia = new Date(data);
  inicioDia.setHours(0, 0, 0, 0);
  
  const fimDia = new Date(data);
  fimDia.setHours(23, 59, 59, 999);
  
  const pedidos = await prisma.pedido.findMany({
    where: {
      criadoEm: {
        gte: inicioDia,
        lte: fimDia
      }
    }
  });
  
  const totalPedidos = pedidos.length;
  const pedidosEntregues = pedidos.filter(p => p.status === 'entregue').length;
  const pedidosCancelados = pedidos.filter(p => p.status === 'cancelado').length;
  
  const facturacao = pedidos
    .filter(p => p.status === 'entregue')
    .reduce((total, p) => total + Number(p.totalMt), 0);
  
  const ticketMedio = pedidosEntregues > 0 ? facturacao / pedidosEntregues : 0;
  
  // Agrupar por forma de pagamento
  const porFormaPagamento = pedidos
    .filter(p => p.status === 'entregue')
    .reduce((acc, p) => {
      const forma = p.formaPagamento || 'não especificado';
      acc[forma] = (acc[forma] || 0) + Number(p.totalMt);
      return acc;
    }, {});
  
  return {
    data: data.toISOString().split('T')[0],
    totalPedidos,
    pedidosEntregues,
    pedidosCancelados,
    facturacao,
    ticketMedio,
    porFormaPagamento
  };
}

/**
 * Mascara dados sensíveis do pedido antes de enviar ao cliente
 */
function mascararDadosSensiveis(pedido) {
  if (pedido.telefoneSms) {
    pedido.telefoneSms = mascaraTelefone(pedido.telefoneSms);
  }
  return pedido;
}

module.exports = {
  criarPedido,
  buscarPedidosActivos,
  actualizarStatus,
  buscarHistorico,
  gerarRelatorioDia,
  mascararDadosSensiveis
};
