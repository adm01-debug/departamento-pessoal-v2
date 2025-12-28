import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TarefaList } from '@/components/tarefas/TarefaList';
describe('TarefaList', () => { it('renders', () => { render(<TarefaList />); expect(true).toBe(true); }); });
