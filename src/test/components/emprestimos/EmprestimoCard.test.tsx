import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmprestimoCard } from '@/components/emprestimos/EmprestimoCard';
describe('EmprestimoCard', () => { it('renders', () => { render(<EmprestimoCard />); expect(true).toBe(true); }); });
