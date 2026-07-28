# 🎨 STYLE_GUIDE.md - Guia de Estilo

## Convenções de Código

### TypeScript
```typescript
// Interfaces com I prefix
interface IUser { }

// Types para unions/intersections
type Status = 'active' | 'inactive';

// Enums em UPPER_CASE
enum Role { ADMIN, USER }
```

### React
```tsx
// Componentes funcionais
const Component: React.FC<Props> = () => { };

// Hooks com use prefix
const useCustomHook = () => { };

// Props destructuring
const Button = ({ label, onClick }: Props) => { };
```

### CSS (Tailwind)
- Mobile-first
- Extrair classes repetidas
- Usar @apply para componentes
