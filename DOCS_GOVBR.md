# Guia Definitivo: Integração Gov.br (SERPRO) - 10/10

Este guia detalha a configuração crítica para manter a integração com o Gov.br resiliente e segura em ambientes de escala empresarial.

## 1. Arquitetura de Ambiente

Garantir que as variáveis de ambiente estejam isoladas por contexto:

| Variável | Desenvolvimento (Sandbox) | Produção (Live) |
|----------|--------------------------|-----------------|
| `GOVBR_ENV` | `staging` | `production` |
| `GOVBR_CLIENT_ID` | Sandbox Client ID | Production Client ID |
| `GOVBR_CLIENT_SECRET` | Sandbox Secret | Production Secret (Seguro) |
| `GOVBR_REDIRECT_URI` | `http://localhost:54321/...` | `https://api.empresa.com/...` |

## 2. Checklist de Integração Crítica (Zero-Downtime)

1. [ ] **Verificação de DNS:** O domínio de redirecionamento deve possuir certificado TLS 1.2+ válido.
2. [ ] **Assinatura de Tokens:** Validar se o SERPRO exige assinatura RS256 e se a chave pública está atualizada no `auth-gov-br`.
3. [ ] **Rate Limiting:** Configurar o `login_rate_limits` no Supabase para evitar força bruta no fluxo de callback.
4. [ ] **Auditoria Legal:** Garantir que o `usuario_id` gerado via Gov.br está sendo mapeado corretamente na tabela `profiles`.
5. [ ] **Fallback de Conectividade:** Implementar retry exponencial na troca de token em caso de instabilidade no SERPRO.

## 3. Resolução de Problemas (Troubleshooting)

### Erro: `invalid_request` ou `mismatching_state`
- **Causa:** O `state` expirou ou foi reutilizado.
- **Solução:** Limpar a tabela `govbr_auth_state` e garantir que o cookie/storage do navegador está enviando o `state` correto.

### Erro: `401 Unauthorized` no Client Secret
- **Causa:** Secret incorreto ou rotacionado no portal do SERPRO.
- **Solução:** Atualizar via `supabase secrets set` imediatamente.

## 4. Segurança de Dados Sensíveis (LGPD)

- Nunca armazene o `access_token` em texto claro por longos períodos.
- Use a tabela `audit_logs` para registrar quem iniciou o fluxo, mas oculte o CPF/Dados Pessoais nos logs de depuração.
- O tempo de vida (TTL) do `state` deve ser de no máximo 10 minutos.

---
*Documentação gerada automaticamente para conformidade técnica 10/10.*
