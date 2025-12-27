# API Documentation

## Services

### admissoesService
```typescript
getAll(): Promise<Admissao[]>
getById(id: string): Promise<Admissao>
create(data: AdmissaoInput): Promise<Admissao>
update(id: string, data: Partial<AdmissaoInput>): Promise<Admissao>
delete(id: string): Promise<void>
```

### colaboradoresService
```typescript
getAll(filters?: ColaboradorFilters): Promise<Colaborador[]>
getById(id: string): Promise<Colaborador>
create(data: ColaboradorInput): Promise<Colaborador>
update(id: string, data: Partial<ColaboradorInput>): Promise<Colaborador>
deactivate(id: string): Promise<void>
```

### backupService
```typescript
getAll(): Promise<Backup[]>
create(): Promise<Backup>
restore(id: string): Promise<void>
delete(id: string): Promise<void>
```

## Hooks

### useColaboradores
```typescript
const { data, isLoading, error, refetch } = useColaboradores(filters?)
```

### useAdmissoes
```typescript
const { data, create, update, delete: remove } = useAdmissoes()
```

### useFeatureFlag
```typescript
const { isEnabled, isLoading } = useFeatureFlag('feature-name')
```
