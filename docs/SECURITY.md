# 🔐 SECURITY.md - Guia de Segurança

## Práticas de Segurança

### Autenticação
- JWT com refresh tokens
- Sessões com timeout de 30 minutos
- MFA disponível para admins

### Autorização
- RBAC (Role-Based Access Control)
- Permissões granulares por módulo
- Audit trail completo

### Dados Sensíveis
- Criptografia AES-256 em repouso
- TLS 1.3 em trânsito
- Mascaramento de CPF/PIS

### LGPD
- Consentimento explícito
- Direito ao esquecimento
- Portabilidade de dados
- DPO designado

### Vulnerabilidades
Reporte via: security@empresa.com
