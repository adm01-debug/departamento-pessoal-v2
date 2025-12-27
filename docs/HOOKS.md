# 🎣 Documentação de Hooks

## Observers

### useIntersectionObserver
Detecta visibilidade de elementos.
```tsx
const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
<div ref={ref}>{isVisible ? 'Visível' : 'Oculto'}</div>
```

### useResizeObserver
Monitora mudanças de tamanho.
```tsx
const [ref, { width, height }] = useResizeObserver();
```

## Eventos

### useClickOutside
Detecta cliques fora do elemento.
```tsx
const ref = useClickOutside(() => setOpen(false));
<div ref={ref}>Dropdown</div>
```

### useHover / useFocus
Estado de hover e focus.
```tsx
const [ref, isHovered] = useHover();
const { isFocused, focusProps } = useFocus();
```

## Estado

### useToggle
Boolean com toggle.
```tsx
const [isOpen, toggle, setIsOpen] = useToggle(false);
```

### useCounter
Contador com limites.
```tsx
const { count, increment, decrement, reset } = useCounter(0, { min: 0, max: 10 });
```

### useArray / useMap
Helpers para arrays e maps.
```tsx
const { array, push, remove, update } = useArray([]);
const { map, set, get, has } = useMap();
```

## Async

### useAsync / useFetch
Operações assíncronas.
```tsx
const { data, loading, error, execute } = useAsync(fetchData);
const { data, loading } = useFetch('/api/users');
```

### useInterval / useTimeout
Timers declarativos.
```tsx
useInterval(callback, 1000);
useTimeout(callback, 5000);
```

## Form

### useInput / useSelect / useCheckbox / useRadio
Helpers para formulários.
```tsx
const name = useInput('');
<input {...name.bind} />

const agree = useCheckbox(false);
<input {...agree.bind} />
```
