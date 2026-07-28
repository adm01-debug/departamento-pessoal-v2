# Documentação de Utilitários

## Formatters

```ts
formatCPF('12345678901')  // '123.456.789-01'
formatCNPJ('12345678000199')  // '12.345.678/0001-99'
formatPhone('11999998888')  // '(11) 99999-8888'
formatCurrency(1234.56)  // 'R\$ 1.234,56'
formatDate('2024-01-15')  // '15/01/2024'
```

## Validators

```ts
validarCPF('529.982.247-25')  // true
validarCNPJ('11.222.333/0001-81')  // true
validarEmail('test@email.com')  // true
validarPIS('123.45678.90-1')  // true
```

## Calculations

```ts
calcularINSS(5000)  // 605.00
calcularIRRF(5000, 0)  // 312.50
calcularValorFerias(5000, 30, 0)  // 6666.67
```
