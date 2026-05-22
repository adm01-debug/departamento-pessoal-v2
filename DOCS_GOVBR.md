# Documentação de Integração Gov.br

Esta documentação descreve os passos necessários para configurar e manter a integração com o provedor de identidade Gov.br (SERPRO).

## Variáveis de Ambiente Necessárias

As seguintes variáveis devem ser configuradas no Supabase (Edge Functions):

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `GOVBR_CLIENT_ID` | Identificador único da aplicação fornecido pelo SERPRO. | `meu-app-id` |
| `GOVBR_CLIENT_SECRET` | Chave secreta para troca de tokens (Manter Segredo). | `scrt_...` |
| `GOVBR_REDIRECT_URI` | URL de callback autorizada no painel do Gov.br. | `https://[project].supabase.co/functions/v1/auth-gov-br` |

## Checklist de Instalação (Novo Ambiente)

1. [ ] **Cadastro no SERPRO:** Garantir que o CNPJ da empresa está vinculado à aplicação no portal do desenvolvedor Gov.br.
2. [ ] **Configuração de Escopos:** Verificar se os escopos `openid`, `profile` e `govbr_confiabilidades` estão liberados.
3. [ ] **Secrets do Supabase:** Executar o comando para cada variável:
   ```bash
   supabase secrets set GOVBR_CLIENT_ID=...
   supabase secrets set GOVBR_CLIENT_SECRET=...
   ```
4. [ ] **Certificados SSL:** Garantir que o ambiente de produção utiliza HTTPS (obrigatório para Gov.br).
5. [ ] **Homologação:** Realizar teste inicial no ambiente de staging (`sso.staging.acesso.gov.br`).

## Fluxo de Autenticação

1. O frontend solicita a URL de autenticação via ação `get_auth_url`.
2. O usuário é redirecionado para o Gov.br.
3. Após o login, o Gov.br redireciona de volta com um `code`.
4. O frontend chama a ação `callback` enviando o `code` e o `state`.
5. A Edge Function valida o `state`, troca o `code` pelo `access_token` e busca os dados do cidadão.

## Segurança e Conformidade

- O `state` é armazenado na tabela `govbr_auth_state` com expiração curta para evitar ataques de CSRF/Replay.
- O `Client Secret` nunca deve ser exposto no frontend ou em logs públicos.
- Logs de erro não devem conter dados sensíveis (CPF, tokens).
