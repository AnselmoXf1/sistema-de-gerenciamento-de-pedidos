import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import '../styles/GerarLink.css';

function GerarLink() {
  const { usuario } = useAuth();
  const [linkGerado, setLinkGerado] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [opcoes, setOpcoes] = useState({
    tipo: 'delivery', // delivery, takeaway, mesa_virtual
    descricao: '',
    validade: '24' // horas
  });

  const gerarLinkUnico = () => {
    setLoading(true);
    
    // Gerar ID único simples
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const linkId = `${opcoes.tipo}-${timestamp}-${random}`;
    
    // Construir URL
    const baseUrl = window.location.origin.replace(':5174', ':5173'); // URL do cliente
    const linkCompleto = `${baseUrl}/link/${linkId}`;
    
    // Gerar QR Code usando API pública
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(linkCompleto)}`;
    
    setTimeout(() => {
      setLinkGerado(linkCompleto);
      setQrCodeUrl(qrUrl);
      setLoading(false);
    }, 500);
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(linkGerado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const compartilharLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Lanchonete da Fátima - Fazer Pedido',
          text: `Faça seu pedido na Lanchonete da Fátima!`,
          url: linkGerado
        });
      } catch (err) {
        console.log('Erro ao compartilhar:', err);
      }
    } else {
      copiarLink();
    }
  };

  const baixarQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${opcoes.tipo}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const novoLink = () => {
    setLinkGerado(null);
    setQrCodeUrl(null);
    setOpcoes({
      tipo: 'delivery',
      descricao: '',
      validade: '24'
    });
  };

  const compartilharWhatsApp = () => {
    const mensagem = `🍔 *Lanchonete da Fátima*\n\nFaça seu pedido agora!\n\n${linkGerado}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  };

  return (
    <Layout>
      <div className="gerar-link-page">
        <div className="page-header">
          <h1>🔗 Gerar Link de Pedido</h1>
          <p>Crie links únicos para receber pedidos de delivery, takeaway ou mesa virtual</p>
        </div>

        {!linkGerado ? (
          <div className="formulario-card">
            <h2>Configurar Link</h2>
            
            <div className="form-group">
              <label>Tipo de Pedido</label>
              <select 
                value={opcoes.tipo}
                onChange={(e) => setOpcoes({...opcoes, tipo: e.target.value})}
                className="form-control"
              >
                <option value="delivery">🛵 Delivery</option>
                <option value="takeaway">🥡 Takeaway (Levantar no Local)</option>
                <option value="mesa_virtual">🪑 Mesa Virtual</option>
              </select>
            </div>

            <div className="form-group">
              <label>Descrição (Opcional)</label>
              <input
                type="text"
                value={opcoes.descricao}
                onChange={(e) => setOpcoes({...opcoes, descricao: e.target.value})}
                placeholder="Ex: Promoção do dia, Cliente VIP, etc."
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Validade do Link</label>
              <select 
                value={opcoes.validade}
                onChange={(e) => setOpcoes({...opcoes, validade: e.target.value})}
                className="form-control"
              >
                <option value="1">1 hora</option>
                <option value="6">6 horas</option>
                <option value="24">24 horas</option>
                <option value="168">7 dias</option>
                <option value="0">Sem validade</option>
              </select>
            </div>

            <div className="info-box">
              <h4>ℹ️ Como funciona:</h4>
              <ul>
                <li>Gere um link único para compartilhar com clientes</li>
                <li>Cliente acessa o link e faz o pedido direto</li>
                <li>Pedido aparece na fila normalmente</li>
                <li>Ideal para delivery, takeaway ou eventos</li>
              </ul>
            </div>

            <button 
              className="btn btn-primary btn-large"
              onClick={gerarLinkUnico}
              disabled={loading}
            >
              {loading ? '⏳ Gerando...' : '✨ Gerar Link Único'}
            </button>
          </div>
        ) : (
          <div className="resultado-card">
            <div className="sucesso-header">
              <div className="sucesso-icon">✅</div>
              <h2>Link Gerado com Sucesso!</h2>
              <p>Compartilhe este link ou QR code com seus clientes</p>
            </div>

            <div className="qrcode-section">
              <div className="qrcode-container">
                <img src={qrCodeUrl} alt="QR Code" />
              </div>
              
              <div className="tipo-badge">
                {opcoes.tipo === 'delivery' && '🛵 Delivery'}
                {opcoes.tipo === 'takeaway' && '🥡 Takeaway'}
                {opcoes.tipo === 'mesa_virtual' && '🪑 Mesa Virtual'}
              </div>
              
              {opcoes.descricao && (
                <p className="descricao-link">{opcoes.descricao}</p>
              )}
            </div>

            <div className="link-section">
              <label>Link Gerado:</label>
              <div className="link-display">
                <input 
                  type="text" 
                  value={linkGerado} 
                  readOnly 
                  className="link-input"
                />
                <button 
                  className="btn btn-secondary"
                  onClick={copiarLink}
                >
                  {copiado ? '✓ Copiado!' : '📋 Copiar'}
                </button>
              </div>
            </div>

            <div className="acoes-grid">
              <button 
                className="btn btn-success"
                onClick={compartilharWhatsApp}
              >
                <span className="btn-icon">💬</span>
                WhatsApp
              </button>

              <button 
                className="btn btn-info"
                onClick={compartilharLink}
              >
                <span className="btn-icon">📤</span>
                Compartilhar
              </button>

              <button 
                className="btn btn-primary"
                onClick={baixarQRCode}
              >
                <span className="btn-icon">⬇️</span>
                Baixar QR
              </button>

              <button 
                className="btn btn-secondary"
                onClick={novoLink}
              >
                <span className="btn-icon">➕</span>
                Novo Link
              </button>
            </div>

            <div className="info-validade">
              {opcoes.validade === '0' ? (
                <p>⏰ Este link não expira</p>
              ) : (
                <p>⏰ Válido por {opcoes.validade} hora(s)</p>
              )}
            </div>

            <div className="instrucoes-uso">
              <h3>📱 Como usar:</h3>
              <ol>
                <li><strong>Compartilhe o link</strong> via WhatsApp, SMS ou redes sociais</li>
                <li><strong>Ou mostre o QR code</strong> para o cliente escanear</li>
                <li><strong>Cliente faz o pedido</strong> direto pelo link</li>
                <li><strong>Pedido aparece na fila</strong> para você preparar</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default GerarLink;
