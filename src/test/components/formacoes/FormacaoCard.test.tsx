import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FormacaoCard } from '@/components/formacoes/FormacaoCard';
describe('FormacaoCard', () => { it('renders', () => { render(<FormacaoCard />); expect(true).toBe(true); }); });
