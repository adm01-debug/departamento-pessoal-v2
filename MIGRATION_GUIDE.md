# 📚 Guia de Migração - Breaking Changes V18

**Última atualização:** Janeiro 2026  
**Versão:** 18.0

---

## 🎯 Visão Geral

Este guia cobre as breaking changes das atualizações de dependências principais:
- **react-router-dom:** v6 → v7
- **zod:** v3 → v4  
- **date-fns:** v3 → v4

---

## 🔄 React Router DOM (v6 → v7)

### Mudanças Principais

#### 1. API de Roteamento Atualizada

**Antes (v6):**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Depois (v7) - Mesma sintaxe funciona!**
```typescript
// A sintaxe do v6 ainda funciona no v7
// Mas há novas features disponíveis
```

#### 2. useNavigate Aprimorado

**Antes:**
```typescript
const navigate = useNavigate();
navigate('/dashboard');
```

**Depois - Novos recursos:**
```typescript
const navigate = useNavigate();

// Navegação relativa melhorada
navigate('..'); // Volta um nível

// State melhorado
navigate('/dashboard', { 
  state: { from: 'login' },
  replace: true 
});
```

#### 3. Loader Functions (Nova Feature)

```typescript
// Agora você pode carregar dados antes de renderizar
export async function loader({ params }) {
  const data = await fetchData(params.id);
  return data;
}

// Na rota
<Route path="/user/:id" element={<User />} loader={loader} />

// No componente
function User() {
  const data = useLoaderData();
  return <div>{data.name}</div>;
}
```

### ✅ Checklist de Migração

- [ ] Testar todas as navegações
- [ ] Verificar redirects
- [ ] Validar parâmetros de rota
- [ ] Testar navegação com state
- [ ] Considerar usar loaders para dados

---

## 🔒 Zod (v3 → v4)

### Mudanças Principais

#### 1. Schema Parsing

**Antes (v3):**
```typescript
const schema = z.object({
  name: z.string(),
  age: z.number()
});

// Parse lançava erro diretamente
const result = schema.parse(data);
```

**Depois (v4):**
```typescript
// Parse continua igual
const result = schema.parse(data);

// Mas safeParse tem melhor typing
const result = schema.safeParse(data);
if (result.success) {
  console.log(result.data); // Type-safe!
}
```

#### 2. Refinements Aprimorados

**Antes:**
```typescript
const schema = z.string().refine(
  (val) => val.length >= 8,
  "Mínimo 8 caracteres"
);
```

**Depois - Mensagens melhores:**
```typescript
const schema = z.string().refine(
  (val) => val.length >= 8,
  {
    message: "Mínimo 8 caracteres",
    path: ["password"], // Caminho melhorado
  }
);
```

#### 3. Transform com Tipos

**Novo em v4:**
```typescript
const schema = z.string()
  .transform((val) => val.toUpperCase())
  .pipe(z.string().min(3));

// Agora o tipo inferido está correto!
type Output = z.infer<typeof schema>; // string (uppercase)
```

### ✅ Checklist de Migração

- [ ] Revisar todos os schemas de validação
- [ ] Testar formulários
- [ ] Verificar mensagens de erro
- [ ] Atualizar custom refinements
- [ ] Validar tipos inferidos

---

## 📅 date-fns (v3 → v4)

### Mudanças Principais

#### 1. Imports Atualizados

**Antes (v3):**
```typescript
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
```

**Depois (v4) - Igual!**
```typescript
// Imports continuam os mesmos
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
```

#### 2. Formato de Datas

**Atenção:**
```typescript
// Alguns formatos mudaram sutilmente
// Antes
format(date, 'dd/MM/yyyy'); // 21/01/2026

// Depois - mesma sintaxe, mas verificar
format(date, 'dd/MM/yyyy', { locale: ptBR });
```

#### 3. Timezone Handling Melhorado

**Novo em v4:**
```typescript
import { formatInTimeZone } from 'date-fns-tz';

// Melhor suporte a timezones
const formatted = formatInTimeZone(
  date,
  'America/Sao_Paulo',
  'dd/MM/yyyy HH:mm'
);
```

### ✅ Checklist de Migração

- [ ] Testar formatação de datas
- [ ] Verificar cálculos de período
- [ ] Validar férias e rescisões
- [ ] Testar relatórios com datas
- [ ] Verificar timezone handling

---

## 🧪 Testando a Migração

### 1. Build Local

```bash
npm install
npm run build
```

**Esperado:** ✅ Build sem erros

### 2. Testes Manuais Críticos

#### Navegação
- [ ] Login → Dashboard
- [ ] Navegação entre páginas
- [ ] Voltar/Avançar do browser
- [ ] Links externos

#### Formulários
- [ ] Cadastro de colaborador
- [ ] Validação de campos
- [ ] Mensagens de erro
- [ ] Submit de formulários

#### Datas
- [ ] Cálculo de férias
- [ ] Cálculo de rescisão
- [ ] Relatórios mensais
- [ ] Formatação de datas

### 3. Testes de Performance

```bash
# Build de produção
npm run build

# Verificar tamanho
ls -lh dist/assets/

# Esperado:
# - index.js < 500kb
# - vendor chunks < 300kb cada
```

---

## 🐛 Problemas Comuns

### React Router

**Problema:** Rota não encontrada  
**Solução:** Verificar path exato e element correto

**Problema:** Navigate não funciona  
**Solução:** Garantir que está dentro de RouterProvider

### Zod

**Problema:** Tipo inferido incorreto  
**Solução:** Usar z.infer<typeof schema>

**Problema:** Validação assíncrona  
**Solução:** Usar .refine() com async

### date-fns

**Problema:** Data formatada incorretamente  
**Solução:** Adicionar locale: ptBR nas opções

**Problema:** Timezone errado  
**Solução:** Usar date-fns-tz para timezones

---

## 📞 Suporte

**Dúvidas?**
- Abra uma issue no GitHub
- Consulte a documentação oficial
- Peça ajuda no canal do time

**Links Úteis:**
- React Router v7: https://reactrouter.com/
- Zod v4: https://zod.dev/
- date-fns v4: https://date-fns.org/

---

**Status:** ✅ Guia Completo  
**Próxima Revisão:** Após feedback do time
