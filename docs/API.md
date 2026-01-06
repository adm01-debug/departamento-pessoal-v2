# API Documentation

## Endpoints

### Colaboradores

- `GET /api/colaboradores` - Lista colaboradores
- `GET /api/colaboradores/:id` - Busca colaborador
- `POST /api/colaboradores` - Cria colaborador
- `PUT /api/colaboradores/:id` - Atualiza colaborador
- `DELETE /api/colaboradores/:id` - Remove colaborador

### Férias

- `GET /api/ferias` - Lista férias
- `POST /api/ferias` - Programa férias
- `POST /api/ferias/:id/aprovar` - Aprova férias
- `POST /api/ferias/:id/rejeitar` - Rejeita férias

### Folha

- `GET /api/folha/:competencia` - Lista folha
- `POST /api/folha/calcular` - Calcula folha
- `POST /api/folha/fechar` - Fecha folha

### Ponto

- `GET /api/ponto` - Lista registros
- `POST /api/ponto/registrar` - Registra ponto

### Autenticação

- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh token
