# Integração eSocial

## Eventos Suportados

### S-1000 - Informações do Empregador
- Cadastro inicial
- Alteração de dados cadastrais

### S-2200 - Cadastramento Inicial/Admissão
- Admissão de trabalhador
- Dados do contrato

### S-2206 - Alteração de Contrato
- Alteração de cargo
- Alteração de salário

### S-2299 - Desligamento
- Demissão
- Rescisão

## Geração de Eventos

```ts
import { gerarXMLEvento } from '@/utils/esocial';

const xml = gerarXMLEvento('S-2200', dados);
```
