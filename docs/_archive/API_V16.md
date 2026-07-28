# API Reference V16

## Overview
Esta documentação descreve os services production-ready implementados na V16.

## Services

### ColaboradorService
```typescript
import { colaboradorServiceReal } from '@/services/index.real';

// Listar colaboradores
const colaboradores = await colaboradorServiceReal.getAll({
  empresa_id: 'uuid',
  status: 'ativo',
  departamento_id: 'uuid',
  search: 'termo'
});

// Buscar por ID
const colaborador = await colaboradorServiceReal.getById('uuid');

// Buscar por CPF
const colaborador = await colaboradorServiceReal.getByCpf('12345678901');

// Criar
const novo = await colaboradorServiceReal.create({
  nome: 'João Silva',
  cpf: '12345678901',
  email: 'joao@email.com',
  data_admissao: '2025-01-01',
  salario: 5000,
  tipo_contrato: 'indeterminado',
  empresa_id: 'uuid'
});

// Atualizar
await colaboradorServiceReal.update('uuid', { salario: 6000 });

// Deletar
await colaboradorServiceReal.delete('uuid');
```

### FolhaService
```typescript
import { folhaServiceReal } from '@/services/index.real';

// Criar folha
const folha = await folhaServiceReal.create({
  empresa_id: 'uuid',
  competencia: '2025-01',
  tipo: 'mensal'
});

// Calcular folha
await folhaServiceReal.calcular('uuid');

// Fechar folha
await folhaServiceReal.fechar('uuid');

// Reabrir folha
await folhaServiceReal.reabrir('uuid');
```

### FeriasService
```typescript
import { feriasServiceReal } from '@/services/index.real';

// Programar férias
await feriasServiceReal.programar('uuid', '2025-02-01', 30, 0);

// Iniciar férias
await feriasServiceReal.iniciar('uuid');

// Concluir férias
await feriasServiceReal.concluir('uuid');

// Buscar férias vencendo
const vencendo = await feriasServiceReal.getVencendo('empresa-uuid', 60);
```

### AuthService
```typescript
import { authServiceReal } from '@/services/index.real';

// Login
const { user, session, error } = await authServiceReal.signIn('email', 'senha');

// Logout
await authServiceReal.signOut();

// Verificar role
const isAdmin = authServiceReal.isAdmin(user);
const isRH = authServiceReal.isRH(user);
```

## Hooks

### useColaboradores
```typescript
import { useColaboradores, useCreateColaborador } from '@/hooks/useColaboradores.real';

const { data, isLoading, error } = useColaboradores({ empresa_id: 'uuid' });
const createMutation = useCreateColaborador();
```

### useFolha
```typescript
import { useFolhas, useCalcularFolha, useFecharFolha } from '@/hooks/useFolha.real';

const { data } = useFolhas({ empresa_id: 'uuid' });
const calcularMutation = useCalcularFolha();
const fecharMutation = useFecharFolha();
```

## Error Handling
Todos os services usam `handleSupabaseError` para tratamento padronizado de erros.
