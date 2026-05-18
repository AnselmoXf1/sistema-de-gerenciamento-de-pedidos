const crypto = require('crypto');

/**
 * Gera número de ticket único para o pedido
 * Formato: P-XXX (ex: P-042)
 */
function gerarTicketNum() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `P-${dia}${mes}${random}`;
}

/**
 * Gera token único para QR code da mesa
 */
function gerarQrToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Mascara número de telefone para privacidade
 * Ex: +258841234567 → +258 84 ***-*567
 */
function mascaraTelefone(telefone) {
  if (!telefone || telefone.length < 10) return telefone;
  
  const inicio = telefone.slice(0, 7);
  const fim = telefone.slice(-4);
  
  return `${inicio} ***-*${fim}`;
}

/**
 * Valida formato de número de telefone moçambicano
 * Formatos aceites: +258841234567, 258841234567, 841234567
 */
function validarTelefoneMZ(telefone) {
  // Remove espaços e caracteres especiais
  const limpo = telefone.replace(/[\s\-\(\)]/g, '');
  
  // Padrões válidos para Moçambique
  const padroes = [
    /^\+258[8][2-7]\d{7}$/,  // +258 8X XXXXXXX
    /^258[8][2-7]\d{7}$/,     // 258 8X XXXXXXX
    /^[8][2-7]\d{7}$/         // 8X XXXXXXX
  ];
  
  return padroes.some(padrao => padrao.test(limpo));
}

/**
 * Normaliza telefone para formato internacional
 * Ex: 841234567 → +258841234567
 */
function normalizarTelefone(telefone) {
  const limpo = telefone.replace(/[\s\-\(\)]/g, '');
  
  if (limpo.startsWith('+258')) return limpo;
  if (limpo.startsWith('258')) return `+${limpo}`;
  if (limpo.startsWith('8')) return `+258${limpo}`;
  
  return telefone;
}

/**
 * Formata valor em Meticais
 * Ex: 350.5 → "350,50 MT"
 */
function formatarMT(valor) {
  return `${Number(valor).toFixed(2).replace('.', ',')} MT`;
}

/**
 * Calcula total do pedido
 */
function calcularTotal(itens) {
  return itens.reduce((total, item) => {
    return total + (item.quantidade * item.preco);
  }, 0);
}

/**
 * Valida status de pedido
 */
function validarStatus(status) {
  const statusValidos = ['aguardando', 'em_preparo', 'pronto', 'entregue', 'cancelado'];
  return statusValidos.includes(status);
}

/**
 * Valida forma de pagamento
 */
function validarFormaPagamento(forma) {
  const formasValidas = ['mpesa', 'emola', 'dinheiro'];
  return formasValidas.includes(forma);
}

/**
 * Gera mensagem de SMS personalizada
 */
function gerarMensagemSms(tipo, dados) {
  const mensagens = {
    pedido_recebido: `Lanchonete da Fátima: Pedido #${dados.ticketNum} recebido! Estamos a preparar. Avisamos quando estiver pronto.`,
    pedido_pronto: `Lanchonete da Fátima: O seu pedido #${dados.ticketNum} está PRONTO! Venha buscar na caixa. Obrigada!`,
    pedido_cancelado: `Lanchonete da Fátima: Pedido #${dados.ticketNum} foi cancelado. Para mais informações, contacte-nos.`
  };
  
  return mensagens[tipo] || 'Lanchonete da Fátima: Actualização do seu pedido.';
}

/**
 * Verifica se é horário de funcionamento
 * (Opcional - pode ser configurado)
 */
function verificarHorarioFuncionamento() {
  const agora = new Date();
  const hora = agora.getHours();
  const diaSemana = agora.getDay();
  
  // Exemplo: Aberto de Segunda a Sábado, 8h às 20h
  const fechado = diaSemana === 0; // Domingo
  const foraHorario = hora < 8 || hora >= 20;
  
  return !fechado && !foraHorario;
}

module.exports = {
  gerarTicketNum,
  gerarQrToken,
  mascaraTelefone,
  validarTelefoneMZ,
  normalizarTelefone,
  formatarMT,
  calcularTotal,
  validarStatus,
  validarFormaPagamento,
  gerarMensagemSms,
  verificarHorarioFuncionamento
};
