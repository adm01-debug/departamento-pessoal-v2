# API Documentation

## Autenticação

### POST /auth/login
Login do usuário.

**Request:**
```json
{"email":"user@email.com","senha":"password"}
```

**Response:**
```json
{"user":{"id":"1","nome":"User"},"token":"jwt-token"}
```

## Colaboradores

### GET /colaboradores
Lista todos os colaboradores.

### GET /colaboradores/:id
Busca colaborador por ID.

### POST /colaboradores
Cria novo colaborador.

### PUT /colaboradores/:id
Atualiza colaborador.

### DELETE /colaboradores/:id
Exclui colaborador.
