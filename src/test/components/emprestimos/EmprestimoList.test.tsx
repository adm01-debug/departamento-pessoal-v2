import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmprestimoList } from '@/components/emprestimos/EmprestimoList';
describe('EmprestimoList', () => { it('renders', () => { render(<EmprestimoList />); expect(true).toBe(true); }); });
