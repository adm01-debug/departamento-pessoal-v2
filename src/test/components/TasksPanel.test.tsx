import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TasksPanel } from '@/components/dashboard/TasksPanel';
const mockTasks = [{ id: '1', title: 'Tarefa 1', status: 'pendente' }];
describe('TasksPanel', () => { it('renderiza tarefas', () => { render(<TasksPanel tasks={mockTasks} />); expect(screen.getByText('Tarefa 1')).toBeInTheDocument(); }); });
