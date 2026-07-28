# 🔧 TROUBLESHOOTING.md

## Problemas Comuns

### Build falha
```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### Erro de CORS
- Verifique VITE_API_URL
- Confirme headers no backend

### Sessão expira rápido
- Ajuste SESSION_TIMEOUT
- Verifique refresh token

### Gráficos não renderizam
- Aguarde dados carregarem
- Verifique ResponsiveContainer

### eSocial rejeitado
- Valide certificado A1
- Confirme ambiente (produção/homologação)
