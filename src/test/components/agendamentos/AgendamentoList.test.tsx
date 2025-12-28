import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AgendamentoList } from '@/components/agendamentos/AgendamentoList';
describe('AgendamentoList', () => { it('renders', () => { render(<AgendamentoList />); expect(true).toBe(true); }); });
