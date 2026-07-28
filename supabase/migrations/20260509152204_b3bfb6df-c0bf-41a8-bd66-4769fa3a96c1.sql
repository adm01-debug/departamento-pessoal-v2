-- 1. Dados de Exemplo para Admissões (Usando campos corretos conforme introspecção)
INSERT INTO public.admissoes (id, empresa_id, nome, email, cpf, cargo, departamento, salario_proposto, data_prevista, etapa)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', (SELECT id FROM public.empresas LIMIT 1), 'João da Silva', 'joao.silva@exemplo.com', '12345678901', 'Desenvolvedor Frontend', 'TI', 7500.00, '2026-06-01', 'documentos'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', (SELECT id FROM public.empresas LIMIT 1), 'Maria Oliveira', 'maria.oliveira@exemplo.com', '98765432100', 'Analista de RH', 'RH', 5500.00, '2026-06-15', 'solicitacao'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', (SELECT id FROM public.empresas LIMIT 1), 'Pedro Santos', 'pedro.santos@exemplo.com', '11122233344', 'Gerente de Vendas', 'Comercial', 12000.00, '2026-05-20', 'contrato')
ON CONFLICT (id) DO NOTHING;

-- 2. Tokens de Acesso (Link Mágico)
INSERT INTO public.admissao_tokens (admissao_id, token, email_candidato, data_expiracao)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'JOAO-2026', 'joao.silva@exemplo.com', now() + interval '7 days'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'PEDRO-SALE', 'pedro.santos@exemplo.com', now() + interval '7 days')
ON CONFLICT (token) DO NOTHING;

-- 3. Logs de Notificação
INSERT INTO public.notificacoes_admissao (admissao_id, tipo, canal, status, mensagem)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'convite', 'email', 'enviado', 'Convite para admissão enviado para João da Silva'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'contrato', 'whatsapp', 'enviado', 'Contrato enviado para Pedro Santos')
ON CONFLICT (id) DO NOTHING;
