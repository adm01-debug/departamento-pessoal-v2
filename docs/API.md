# Documentação da API

## Endpoints

### Colaboradores

- `GET /api/colaboradores` - Listar colaboradores
- `POST /api/colaboradores` - Criar colaborador
- `GET /api/colaboradores/:id` - Buscar colaborador
- `PUT /api/colaboradores/:id` - Atualizar colaborador
- `DELETE /api/colaboradores/:id` - Excluir colaborador

### Férias

- `GET /api/ferias` - Listar férias
- `POST /api/ferias` - Programar férias
- `POST /api/ferias/:id/aprovar` - Aprovar férias

### Folha

- `GET /api/folha` - Listar folhas
- `POST /api/folha/calcular` - Calcular folha
- `POST /api/folha/fechar` - Fechar folha

### Ponto

- `GET /api/ponto` - Listar registros
- `POST /api/ponto/registrar` - Registrar ponto
