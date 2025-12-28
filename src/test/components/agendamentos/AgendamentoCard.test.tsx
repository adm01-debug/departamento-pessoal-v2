import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AgendamentoCard } from '@/components/agendamentos/AgendamentoCard';
describe('AgendamentoCard', () => { it('renders', () => { render(<AgendamentoCard />); expect(true).toBe(true); }); });
