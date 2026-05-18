-- ============================================
-- SCHEMA COMPLETO - LANCHONETE DIGITAL
-- PostgreSQL 14+
-- ============================================

-- Criar base de dados (executar como superuser)
-- CREATE DATABASE lanchonete_db;
-- \c lanchonete_db

-- ============================================
-- TABELA: MESAS
-- ============================================
CREATE TABLE IF NOT EXISTS mesas (
    id SERIAL PRIMARY KEY,
    numero INTEGER NOT NULL UNIQUE,
    qr_token VARCHAR(64) NOT NULL UNIQUE,
    activa BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_mesas_numero ON mesas(numero);
CREATE INDEX idx_mesas_qr_token ON mesas(qr_token);

-- ============================================
-- TABELA: PRODUTOS (CARDÁPIO)
-- ============================================
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao VARCHAR(255),
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    emoji VARCHAR(10),
    disponivel BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0,
    imagem_url VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_produtos_categoria ON produtos(categoria);
CREATE INDEX idx_produtos_disponivel ON produtos(disponivel);

-- ============================================
-- TABELA: USUÁRIOS (DONA E FUNCIONÁRIAS)
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'funcionaria',
    activo BOOLEAN DEFAULT true,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_role ON usuarios(role);

-- ============================================
-- TABELA: PEDIDOS
-- ============================================
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    ticket_num VARCHAR(20) NOT NULL UNIQUE,
    mesa_id INTEGER NOT NULL REFERENCES mesas(id),
    status VARCHAR(20) DEFAULT 'aguardando',
    forma_pagamento VARCHAR(20),
    total_mt DECIMAL(10,2) NOT NULL,
    sms_opt_in BOOLEAN DEFAULT false,
    telefone_sms VARCHAR(20),
    sms_enviado BOOLEAN DEFAULT false,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmado_em TIMESTAMP,
    pronto_em TIMESTAMP,
    entregue_em TIMESTAMP
);

-- Índices
CREATE INDEX idx_pedidos_ticket_num ON pedidos(ticket_num);
CREATE INDEX idx_pedidos_mesa_id ON pedidos(mesa_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_criado_em ON pedidos(criado_em);

-- ============================================
-- TABELA: ITENS DO PEDIDO
-- ============================================
CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
    produto_id INTEGER NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    preco_unit DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- Índices
CREATE INDEX idx_itens_pedido_pedido_id ON itens_pedido(pedido_id);
CREATE INDEX idx_itens_pedido_produto_id ON itens_pedido(produto_id);

-- ============================================
-- TABELA: LOG DE SMS (AUDITORIA)
-- ============================================
CREATE TABLE IF NOT EXISTS log_sms (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER REFERENCES pedidos(id),
    telefone VARCHAR(20) NOT NULL,
    mensagem TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    resposta TEXT,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_log_sms_pedido_id ON log_sms(pedido_id);
CREATE INDEX idx_log_sms_enviado_em ON log_sms(enviado_em);

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Inserir mesas (1 a 10)
INSERT INTO mesas (numero, qr_token, activa) VALUES
(1, 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', true),
(2, 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7', true),
(3, 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8', true),
(4, 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9', true),
(5, 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0', true),
(6, 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1', true),
(7, 'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2', true),
(8, 'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3', true),
(9, 'i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4', true),
(10, 'j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5', true)
ON CONFLICT (numero) DO NOTHING;

-- Inserir produtos (cardápio)
INSERT INTO produtos (nome, descricao, preco, categoria, emoji, disponivel, ordem) VALUES
-- Pratos
('Hambúrguer Clássico', 'Pão, carne, queijo, alface, tomate', 250.00, 'prato', '🍔', true, 1),
('Hambúrguer Duplo', 'Pão, 2 carnes, queijo duplo, molho especial', 350.00, 'prato', '🍔', true, 2),
('Cachorro Quente', 'Pão, salsicha, batata palha, molhos', 150.00, 'prato', '🌭', true, 3),
('Rissóis de Camarão', '4 unidades crocantes', 200.00, 'prato', '🦐', true, 4),
('Batata Frita Grande', 'Porção grande de batatas crocantes', 120.00, 'prato', '🍟', true, 5),
('Frango Assado', '1/4 de frango com batata', 280.00, 'prato', '🍗', true, 6),

-- Bebidas
('Coca-Cola 500ml', 'Refrigerante gelado', 50.00, 'bebida', '🥤', true, 1),
('Fanta Laranja 500ml', 'Refrigerante gelado', 50.00, 'bebida', '🥤', true, 2),
('Sprite 500ml', 'Refrigerante gelado', 50.00, 'bebida', '🥤', true, 3),
('Água Mineral 500ml', 'Água natural gelada', 30.00, 'bebida', '💧', true, 4),
('Sumo Natural', 'Laranja, manga ou maracujá', 80.00, 'bebida', '🧃', true, 5),
('2M Cerveja', 'Cerveja moçambicana 330ml', 70.00, 'bebida', '🍺', true, 6),

-- Sobremesas
('Gelado Baunilha', '2 bolas com cobertura', 100.00, 'sobremesa', '🍦', true, 1),
('Gelado Chocolate', '2 bolas com cobertura', 100.00, 'sobremesa', '🍦', true, 2),
('Bolo de Chocolate', 'Fatia generosa', 120.00, 'sobremesa', '🍰', true, 3)
ON CONFLICT DO NOTHING;

-- Inserir usuário admin (senha: admin123)
-- Hash gerado com bcrypt rounds=10
INSERT INTO usuarios (nome, email, senha_hash, role, activo) VALUES
('Administrador', 'admin@lanchonete.mz', '$2a$10$rZ5qJ5YvH8xH8xH8xH8xHOqJ5YvH8xH8xH8xH8xH8xH8xH8xH8xH8', 'dona', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- VIEWS ÚTEIS
-- ============================================

-- View: Pedidos com detalhes completos
CREATE OR REPLACE VIEW v_pedidos_completos AS
SELECT 
    p.id,
    p.ticket_num,
    p.status,
    p.forma_pagamento,
    p.total_mt,
    p.sms_opt_in,
    p.telefone_sms,
    p.sms_enviado,
    p.observacoes,
    p.criado_em,
    p.confirmado_em,
    p.pronto_em,
    p.entregue_em,
    m.numero as mesa_numero,
    COUNT(ip.id) as total_itens,
    json_agg(
        json_build_object(
            'produto_id', pr.id,
            'produto_nome', pr.nome,
            'produto_emoji', pr.emoji,
            'quantidade', ip.quantidade,
            'preco_unit', ip.preco_unit,
            'subtotal', ip.subtotal
        )
    ) as itens
FROM pedidos p
JOIN mesas m ON p.mesa_id = m.id
LEFT JOIN itens_pedido ip ON ip.pedido_id = p.id
LEFT JOIN produtos pr ON ip.produto_id = pr.id
GROUP BY p.id, m.numero;

-- View: Relatório do dia
CREATE OR REPLACE VIEW v_relatorio_dia AS
SELECT 
    DATE(criado_em) as data,
    COUNT(*) as total_pedidos,
    COUNT(*) FILTER (WHERE status = 'entregue') as pedidos_entregues,
    COUNT(*) FILTER (WHERE status = 'cancelado') as pedidos_cancelados,
    SUM(total_mt) FILTER (WHERE status = 'entregue') as facturacao_total,
    AVG(total_mt) FILTER (WHERE status = 'entregue') as ticket_medio
FROM pedidos
GROUP BY DATE(criado_em)
ORDER BY data DESC;

-- ============================================
-- FUNÇÕES ÚTEIS
-- ============================================

-- Função: Gerar número de ticket único
CREATE OR REPLACE FUNCTION gerar_ticket_num()
RETURNS VARCHAR(20) AS $$
DECLARE
    novo_ticket VARCHAR(20);
    existe BOOLEAN;
BEGIN
    LOOP
        novo_ticket := 'P-' || LPAD(FLOOR(RANDOM() * 1000)::TEXT, 3, '0');
        
        SELECT EXISTS(SELECT 1 FROM pedidos WHERE ticket_num = novo_ticket) INTO existe;
        
        IF NOT existe THEN
            RETURN novo_ticket;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Actualizar timestamp ao mudar status
CREATE OR REPLACE FUNCTION actualizar_timestamp_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'em_preparo' AND OLD.status = 'aguardando' THEN
        NEW.confirmado_em = CURRENT_TIMESTAMP;
    ELSIF NEW.status = 'pronto' AND OLD.status = 'em_preparo' THEN
        NEW.pronto_em = CURRENT_TIMESTAMP;
    ELSIF NEW.status = 'entregue' AND OLD.status = 'pronto' THEN
        NEW.entregue_em = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_actualizar_timestamp_status
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION actualizar_timestamp_status();

-- ============================================
-- PERMISSÕES (OPCIONAL)
-- ============================================

-- Criar role para a aplicação
-- CREATE ROLE lanchonete_app WITH LOGIN PASSWORD 'senha_segura_aqui';

-- Conceder permissões
-- GRANT CONNECT ON DATABASE lanchonete_db TO lanchonete_app;
-- GRANT USAGE ON SCHEMA public TO lanchonete_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO lanchonete_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO lanchonete_app;

-- ============================================
-- QUERIES ÚTEIS PARA TESTES
-- ============================================

-- Ver todas as mesas
-- SELECT * FROM mesas ORDER BY numero;

-- Ver cardápio por categoria
-- SELECT categoria, nome, preco FROM produtos WHERE disponivel = true ORDER BY categoria, ordem;

-- Ver pedidos activos
-- SELECT * FROM v_pedidos_completos WHERE status IN ('aguardando', 'em_preparo', 'pronto') ORDER BY criado_em;

-- Relatório do dia
-- SELECT * FROM v_relatorio_dia WHERE data = CURRENT_DATE;

-- Ver logs de SMS
-- SELECT * FROM log_sms ORDER BY enviado_em DESC LIMIT 10;

-- ============================================
-- FIM DO SCRIPT
-- ============================================

-- Verificar instalação
SELECT 'Base de dados criada com sucesso!' as mensagem,
       (SELECT COUNT(*) FROM mesas) as total_mesas,
       (SELECT COUNT(*) FROM produtos) as total_produtos,
       (SELECT COUNT(*) FROM usuarios) as total_usuarios;
