const AfricasTalking = require('africastalking');
const prisma = require('../config/database');

// Verificar se credenciais estão configuradas
const SMS_CONFIGURADO = !!(process.env.AT_API_KEY && process.env.AT_USERNAME);

// Inicializar Africa's Talking apenas se configurado
let at, sms;
if (SMS_CONFIGURADO) {
  const credentials = {
    apiKey: process.env.AT_API_KEY,
    username: process.env.AT_USERNAME
  };
  at = AfricasTalking(credentials);
  sms = at.SMS;
  console.log('✅ Africa\'s Talking configurado');
} else {
  console.log('⚠️  Africa\'s Talking NÃO configurado - usando modo MOCK');
}

/**
 * Envia SMS usando Africa's Talking
 * @param {string} telefone - Número no formato +258XXXXXXXXX
 * @param {string} mensagem - Texto da mensagem
 * @param {number} pedidoId - ID do pedido (opcional, para log)
 * @returns {Promise<Object>} Resultado do envio
 */
async function enviarSms(telefone, mensagem, pedidoId = null) {
  try {
    console.log(`📤 Enviando SMS para ${telefone}...`);
    
    const opcoes = {
      to: [telefone],
      message: mensagem,
    };
    
    // Adicionar sender ID se configurado
    if (process.env.AT_SENDER_ID) {
      opcoes.from = process.env.AT_SENDER_ID;
    }
    
    const resultado = await sms.send(opcoes);
    
    console.log('✅ SMS enviado com sucesso:', resultado);
    
    // Registar log na base de dados
    await registarLogSms({
      pedidoId,
      telefone,
      mensagem,
      status: 'enviado',
      resposta: JSON.stringify(resultado)
    });
    
    return {
      sucesso: true,
      resultado
    };
    
  } catch (erro) {
    console.error('❌ Erro ao enviar SMS:', erro);
    
    // Registar erro no log
    await registarLogSms({
      pedidoId,
      telefone,
      mensagem,
      status: 'falhou',
      resposta: JSON.stringify({ erro: erro.message })
    });
    
    return {
      sucesso: false,
      erro: erro.message
    };
  }
}

/**
 * Registra log de SMS na base de dados
 */
async function registarLogSms(dados) {
  try {
    await prisma.logSms.create({
      data: {
        pedidoId: dados.pedidoId,
        telefone: dados.telefone,
        mensagem: dados.mensagem,
        status: dados.status,
        resposta: dados.resposta
      }
    });
  } catch (erro) {
    console.error('❌ Erro ao registar log SMS:', erro);
  }
}

/**
 * Envia SMS de notificação de pedido pronto
 */
async function notificarPedidoPronto(pedido) {
  if (!pedido.smsOptIn || !pedido.telefoneSms) {
    console.log('⚠️  SMS não enviado: cliente não fez opt-in');
    return { sucesso: false, motivo: 'opt-in desactivado' };
  }
  
  if (pedido.smsEnviado) {
    console.log('⚠️  SMS já foi enviado anteriormente');
    return { sucesso: false, motivo: 'já enviado' };
  }
  
  const mensagem = `Lanchonete da Fátima: O seu pedido #${pedido.ticketNum} está PRONTO! Venha buscar na caixa. Obrigada!`;
  
  const resultado = await enviarSms(
    pedido.telefoneSms,
    mensagem,
    pedido.id
  );
  
  if (resultado.sucesso) {
    // Marcar SMS como enviado
    await prisma.pedido.update({
      where: { id: pedido.id },
      data: { smsEnviado: true }
    });
  }
  
  return resultado;
}

/**
 * Envia SMS de confirmação de pedido (opcional)
 */
async function notificarPedidoRecebido(pedido) {
  if (!pedido.smsOptIn || !pedido.telefoneSms) {
    return { sucesso: false, motivo: 'opt-in desactivado' };
  }
  
  const mensagem = `Lanchonete da Fátima: Pedido #${pedido.ticketNum} recebido! Estamos a preparar. Avisamos quando estiver pronto.`;
  
  return await enviarSms(
    pedido.telefoneSms,
    mensagem,
    pedido.id
  );
}

/**
 * Verifica saldo de SMS (Africa's Talking)
 */
async function verificarSaldo() {
  try {
    const application = at.APPLICATION;
    const saldo = await application.fetchApplicationData();
    console.log('💰 Saldo SMS:', saldo);
    return saldo;
  } catch (erro) {
    console.error('❌ Erro ao verificar saldo:', erro);
    return null;
  }
}

module.exports = {
  enviarSms,
  notificarPedidoPronto,
  notificarPedidoRecebido,
  verificarSaldo
};
