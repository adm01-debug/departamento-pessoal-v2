# API Documentation

## Authentication

### POST /auth/login
Login with email and password.

### POST /auth/logout
Logout current user.

## Colaboradores

### GET /colaboradores
List all colaboradores.

### GET /colaboradores/:id
Get colaborador by ID.

### POST /colaboradores
Create new colaborador.

### PUT /colaboradores/:id
Update colaborador.

### DELETE /colaboradores/:id
Delete colaborador.

## Folha de Pagamento

### GET /folha
List all folhas.

### POST /folha/:id/calcular
Calculate folha.

### POST /folha/:id/fechar
Close folha.

## Férias

### GET /ferias
List all ferias.

### POST /ferias/:id/aprovar
Approve ferias.

### POST /ferias/:id/cancelar
Cancel ferias.
