# Guia de Integração Gov.br (SERPRO)

Este documento descreve os passos necessários para configurar a integração com o Gov.br utilizando o Client Secret do SERPRO.

## 1. Variáveis de Ambiente (Secrets)

As seguintes variáveis devem ser configuradas no Supabase Edge Functions:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `GOVBR_CLIENT_ID` | ID do Cliente fornecido pelo SERPRO | `app-id-123` |
| `GOVBR_CLIENT_SECRET` | Secret do Cliente (Mantenha em sigilo!) | `scr_...` |
| `GOVBR_REDIRECT_URI` | URL de callback autorizada | `https://[ref].supabase.co/functions/v1/auth-gov-br` |

## 2. Checklist de Configuração por Ambiente

### Desenvolvimento (Local/Staging)
- [ ] Utilizar URLs de homologação (`sso.staging.acesso.gov.br`)
- [ ] Garantir que o `REDIRECT_URI` está cadastrado no painel do SERPRO
- [ ] Configurar `WEBHOOK_SECRET` para testes de callback

### Produção
- [ ] Alterar URLs para produção (`sso.acesso.gov.br`)
- [ ] Validar Certificados Digitais se necessário (mútua TLS)
- [ ] Revisar limites de requisição (Rate Limiting)

## 3. Fluxo de Autenticação
1. O frontend chama a action `get_auth_url` para obter o link de login.
2. O usuário é redirecionado para o Gov.br.
3. Após login, o usuário volta com um `code`.
4. O backend troca o `code` pelo `access_token` e atualiza o perfil do usuário.

## 4. Troubleshooting
- **Erro 401**: Verifique se o `GOVBR_CLIENT_SECRET` está correto e não expirou.
- **Estado Inválido**: Verifique se os cookies/localStorage estão permitindo o armazenamento do `state`.
