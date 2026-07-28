# 📚 API Reference - V15

## Visão Geral
Documentação completa da API do Sistema Departamento Pessoal V15.

## Autenticação
```typescript
// Header de autenticação
Authorization: Bearer <token>
```

## Endpoints

### Colaboradores
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/colaboradores | Lista colaboradores |
| GET | /api/colaboradores/:id | Busca colaborador |
| POST | /api/colaboradores | Cria colaborador |
| PUT | /api/colaboradores/:id | Atualiza colaborador |
| DELETE | /api/colaboradores/:id | Remove colaborador |

### Empresas
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/empresas | Lista empresas |
| GET | /api/empresas/:id | Busca empresa |
| POST | /api/empresas | Cria empresa |
| PUT | /api/empresas/:id | Atualiza empresa |

### Folha de Pagamento
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/folha | Lista folhas |
| POST | /api/folha/calcular | Calcula folha |
| POST | /api/folha/fechar | Fecha folha |

### Férias
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/ferias | Lista férias |
| POST | /api/ferias/solicitar | Solicita férias |
| PUT | /api/ferias/:id/aprovar | Aprova férias |

### Ponto
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | /api/ponto | Lista registros |
| POST | /api/ponto/registrar | Registra ponto |
| GET | /api/ponto/espelho/:mes | Espelho de ponto |

## Exemplos

### Criar Colaborador
```bash
curl -X POST /api/colaboradores \
  -H 'Authorization: Bearer token' \
  -d '{"nome": "João Silva", "cpf": "123.456.789-00"}'
```

### Calcular Folha
```bash
curl -X POST /api/folha/calcular \
  -H 'Authorization: Bearer token' \
  -d '{"empresa_id": "uuid", "competencia": "2026-01"}'
```

