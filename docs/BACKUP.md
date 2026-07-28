# 💾 BACKUP.md - Estratégia de Backup

## Política de Backup

### Frequência
- Diário: 00:00 UTC (incremental)
- Semanal: Domingo (full)
- Mensal: Dia 1 (arquivamento)

### Retenção
- Diários: 7 dias
- Semanais: 4 semanas
- Mensais: 12 meses

### Armazenamento
- Primário: S3 us-east-1
- Secundário: S3 sa-east-1
- Criptografia: AES-256

### Recovery
- RTO: 4 horas
- RPO: 24 horas
