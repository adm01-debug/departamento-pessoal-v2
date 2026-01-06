# Documentação de Componentes

## Common Components

### Avatar
```tsx
<Avatar name="João Silva" size="md" />
```

### StatusBadge
```tsx
<StatusBadge status="ativo" />
```

### LoadingSpinner
```tsx
<LoadingSpinner size="lg" text="Carregando..." />
```

### EmptyState
```tsx
<EmptyState
  title="Nenhum item"
  description="Adicione itens"
  action={{ label: 'Adicionar', onClick: handleAdd }}
/>
```

## Forms

### ColaboradorForm
```tsx
<ColaboradorForm
  cargos={cargos}
  departamentos={departamentos}
  onSubmit={handleSubmit}
/>
```
