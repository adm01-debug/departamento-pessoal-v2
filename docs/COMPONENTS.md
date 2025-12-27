# 📚 Documentação de Componentes

## Acessibilidade (a11y)

### SkipLink
Link invisível para pular para conteúdo principal.
```tsx
<SkipLink href="#main-content">Pular para conteúdo</SkipLink>
```

### LiveRegion
Região para anúncios de leitores de tela.
```tsx
<LiveRegion message={message} priority="polite" />
```

### FocusTrap
Mantém o foco dentro de um container.
```tsx
<FocusTrap active={isModalOpen}>
  <Modal>...</Modal>
</FocusTrap>
```

### KeyboardNav
Navegação por teclado em listas.
```tsx
<KeyboardNav onEscape={close}>
  <MenuItem data-nav-item>Item 1</MenuItem>
</KeyboardNav>
```

## Performance

### LazyImage
Carregamento lazy de imagens.
```tsx
<LazyImage src="/image.jpg" alt="Descrição" />
```

### VirtualList
Lista virtualizada para grandes conjuntos.
```tsx
<VirtualList items={items} itemHeight={50} containerHeight={400} renderItem={item => <Row>{item}</Row>} />
```

### InfiniteScroll
Scroll infinito com carregamento automático.
```tsx
<InfiniteScroll onLoadMore={loadMore} hasMore={hasMore}>
  {items.map(item => <Item key={item.id} />)}
</InfiniteScroll>
```

## Animações

### FadeIn / SlideIn / ScaleIn
Animações de entrada.
```tsx
<FadeIn delay={100}><Content /></FadeIn>
<SlideIn direction="bottom"><Content /></SlideIn>
<ScaleIn duration={500}><Content /></ScaleIn>
```

### Stagger
Atraso escalonado em children.
```tsx
<Stagger delay={100}>
  <FadeIn>Item 1</FadeIn>
  <FadeIn>Item 2</FadeIn>
</Stagger>
```

## Layout

### PageHeader / SectionHeader
Headers padronizados.
```tsx
<PageHeader title="Título" description="Descrição" actions={<Button>Ação</Button>} />
```

### Grid / Stack
Containers de layout.
```tsx
<Grid cols={3} gap={4}><Card /><Card /><Card /></Grid>
<Stack direction="row" gap={2}><Item /><Item /></Stack>
```
