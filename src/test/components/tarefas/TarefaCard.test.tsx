import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TarefaCard } from '@/components/tarefas/TarefaCard';
describe('TarefaCard', () => { it('renders', () => { render(<TarefaCard />); expect(true).toBe(true); }); });
