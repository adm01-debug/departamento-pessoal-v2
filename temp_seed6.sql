DO $$
DECLARE
  emp_id uuid := '66104399-aba8-4105-bbd3-9bf67820c1d0'::uuid;
  f1_id uuid := 'dd000000-0000-0000-0000-000000000001'::uuid;
  f2_id uuid := 'dd000000-0000-0000-0000-000000000002'::uuid;
  c1_id uuid;
  c2_id uuid;
  c3_id uuid;
  t1_id uuid;
  t2_id uuid;
  t3_id uuid;
BEGIN
  -- Lançamentos contábeis
  INSERT INTO public.lancamentos_contabeis (empresa_id, folha_id, data_lancamento, descricao, valor, conta_debito_id, conta_credito_id, origem, status)
  SELECT emp_id, f1_id, '2026-06-30', 'Provisão Folha 06/2026 - Salários', 73450.00,
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '3.1.01.001'),
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '2.1.01.001'),
         'folha', 'efetivado'
  WHERE NOT EXISTS (SELECT 1 FROM public.lancamentos_contabeis WHERE empresa_id = emp_id AND folha_id = f1_id AND descricao LIKE '%Salários%');

  INSERT INTO public.lancamentos_contabeis (empresa_id, folha_id, data_lancamento, descricao, valor, conta_debito_id, conta_credito_id, origem, status)
  SELECT emp_id, f1_id, '2026-06-30', 'INSS Patronal 06/2026', 20419.10,
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '3.1.01.002'),
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '2.1.01.002'),
         'folha', 'efetivado'
  WHERE NOT EXISTS (SELECT 1 FROM public.lancamentos_contabeis WHERE empresa_id = emp_id AND folha_id = f1_id AND descricao LIKE '%INSS%');

  INSERT INTO public.lancamentos_contabeis (empresa_id, folha_id, data_lancamento, descricao, valor, conta_debito_id, conta_credito_id, origem, status)
  SELECT emp_id, f1_id, '2026-06-30', 'FGTS 06/2026', 5876.00,
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '3.1.01.003'),
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '2.1.01.003'),
         'folha', 'efetivado'
  WHERE NOT EXISTS (SELECT 1 FROM public.lancamentos_contabeis WHERE empresa_id = emp_id AND folha_id = f1_id AND descricao LIKE '%FGTS%');

  INSERT INTO public.lancamentos_contabeis (empresa_id, folha_id, data_lancamento, descricao, valor, conta_debito_id, conta_credito_id, origem, status)
  SELECT emp_id, f2_id, '2026-05-31', 'Provisão Folha 05/2026 - Salários', 71890.00,
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '3.1.01.001'),
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '2.1.01.001'),
         'folha', 'efetivado'
  WHERE NOT EXISTS (SELECT 1 FROM public.lancamentos_contabeis WHERE empresa_id = emp_id AND folha_id = f2_id);

  INSERT INTO public.lancamentos_contabeis (empresa_id, folha_id, data_lancamento, descricao, valor, conta_debito_id, conta_credito_id, origem, status)
  SELECT emp_id, f2_id, '2026-05-31', 'INSS Patronal 05/2026', 19985.42,
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '3.1.01.002'),
         (SELECT id FROM public.plano_contas WHERE empresa_id = emp_id AND codigo = '2.1.01.002'),
         'folha', 'efetivado'
  WHERE NOT EXISTS (SELECT 1 FROM public.lancamentos_contabeis WHERE empresa_id = emp_id AND folha_id = f2_id AND descricao LIKE '%INSS%');

  -- Remessas CNAB
  INSERT INTO public.cnab_remessas (empresa_id, banco_codigo, sequencial_arquivo, data_geracao, status, total_pagamentos, valor_total)
  SELECT emp_id, '001', 1, '2026-07-01 09:30:00+00'::timestamptz, 'enviado', 12, 57220.00
  WHERE NOT EXISTS (SELECT 1 FROM public.cnab_remessas WHERE empresa_id = emp_id AND sequencial_arquivo = 1);

  INSERT INTO public.cnab_remessas (empresa_id, banco_codigo, sequencial_arquivo, data_geracao, status, total_pagamentos, valor_total)
  SELECT emp_id, '001', 2, '2026-06-03 09:30:00+00'::timestamptz, 'enviado', 12, 56070.00
  WHERE NOT EXISTS (SELECT 1 FROM public.cnab_remessas WHERE empresa_id = emp_id AND sequencial_arquivo = 2);

  INSERT INTO public.cnab_remessas (empresa_id, banco_codigo, sequencial_arquivo, data_geracao, status, total_pagamentos, valor_total)
  SELECT emp_id, '001', 3, '2025-12-22 10:00:00+00'::timestamptz, 'enviado', 12, 59910.00
  WHERE NOT EXISTS (SELECT 1 FROM public.cnab_remessas WHERE empresa_id = emp_id AND sequencial_arquivo = 3);

  -- Lotes PIX
  INSERT INTO public.pix_lotes (empresa_id, data_criacao, status, valor_total, quantidade_pagamentos)
  SELECT emp_id, '2026-07-01 09:35:00+00'::timestamptz, 'processado', 57220.00, 12
  WHERE NOT EXISTS (SELECT 1 FROM public.pix_lotes WHERE empresa_id = emp_id AND data_criacao = '2026-07-01'::date);

  INSERT INTO public.pix_lotes (empresa_id, data_criacao, status, valor_total, quantidade_pagamentos)
  SELECT emp_id, '2026-06-03 09:35:00+00'::timestamptz, 'processado', 56070.00, 12
  WHERE NOT EXISTS (SELECT 1 FROM public.pix_lotes WHERE empresa_id = emp_id AND data_criacao = '2026-06-03'::date);

  -- Contatos de contabilidade
  INSERT INTO public.contabilidade_contatos (empresa_id, nome, email, telefone, escritorio, ativo)
  SELECT emp_id, 'Ana Contadora - MGA Auditoria', 'ana.silva@mga-auditoria.com.br', '(11) 3456-7890', 'MGA Auditoria e Consultoria', true
  WHERE NOT EXISTS (SELECT 1 FROM public.contabilidade_contatos WHERE empresa_id = emp_id AND nome LIKE '%Ana%');

  INSERT INTO public.contabilidade_contatos (empresa_id, nome, email, telefone, escritorio, ativo)
  SELECT emp_id, 'Roberto Fiscal - BPL Contábil', 'roberto.santos@bplcontabil.com.br', '(11) 2345-6789', 'BPL Contábil', true
  WHERE NOT EXISTS (SELECT 1 FROM public.contabilidade_contatos WHERE empresa_id = emp_id AND nome LIKE '%Roberto%');

  INSERT INTO public.contabilidade_contatos (empresa_id, nome, email, telefone, escritorio, ativo)
  SELECT emp_id, 'Carla Tributos - Solução Fiscal', 'carla.souza@solucaofiscal.com.br', '(11) 4567-8901', 'Solução Fiscal Ltda', true
  WHERE NOT EXISTS (SELECT 1 FROM public.contabilidade_contatos WHERE empresa_id = emp_id AND nome LIKE '%Carla%');

  -- Threads
  SELECT id INTO c1_id FROM public.contabilidade_contatos WHERE empresa_id = emp_id AND nome LIKE 'Ana%' LIMIT 1;
  SELECT id INTO c2_id FROM public.contabilidade_contatos WHERE empresa_id = emp_id AND nome LIKE 'Roberto%' LIMIT 1;
  SELECT id INTO c3_id FROM public.contabilidade_contatos WHERE empresa_id = emp_id AND nome LIKE 'Carla%' LIMIT 1;

  INSERT INTO public.contabilidade_threads (empresa_id, assunto, categoria, status, prioridade, contato_id, ultima_atividade_em)
  SELECT emp_id, 'Encerramento Fiscal 06/2026', 'tributos', 'respondido', 'alta', c1_id, '2026-07-15 14:30:00+00'::timestamptz
  WHERE NOT EXISTS (SELECT 1 FROM public.contabilidade_threads WHERE empresa_id = emp_id AND assunto LIKE '%Encerramento%');

  INSERT INTO public.contabilidade_threads (empresa_id, assunto, categoria, status, prioridade, contato_id, ultima_atividade_em)
  SELECT emp_id, 'Inconsistência eSocial S-2200', 'esocial', 'aberto', 'normal', c2_id, '2026-07-22 10:15:00+00'::timestamptz
  WHERE NOT EXISTS (SELECT 1 FROM public.contabilidade_threads WHERE empresa_id = emp_id AND assunto LIKE '
