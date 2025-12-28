import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultadoCard } from '@/components/resultados/ResultadoCard';
describe('ResultadoCard', () => { it('renders', () => { render(<ResultadoCard />); expect(true).toBe(true); }); });
