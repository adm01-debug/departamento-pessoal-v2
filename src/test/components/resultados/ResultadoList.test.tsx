import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultadoList } from '@/components/resultados/ResultadoList';
describe('ResultadoList', () => { it('renders', () => { render(<ResultadoList />); expect(true).toBe(true); }); });
