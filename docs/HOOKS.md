# Documentação de Hooks

## Data Fetching

### useColaboradores
```tsx
const { data, isLoading, error } = useColaboradores();
```

### useColaborador
```tsx
const { data } = useColaborador(id);
```

## Mutations

### useCreateColaborador
```tsx
const mutation = useCreateColaborador();
mutation.mutate(data);
```

## Utilities

### useDebounce
```tsx
const debouncedValue = useDebounce(value, 300);
```

### useLocalStorage
```tsx
const [value, setValue] = useLocalStorage('key', 'default');
```

### usePagination
```tsx
const { currentPage, totalPages, nextPage } = usePagination({ totalItems: 100 });
```
