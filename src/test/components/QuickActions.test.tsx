import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuickActions } from '@/components/dashboard/QuickActions';
const mockActions = [{ id: '1', label: 'Nova Admissão', icon: 'add', onClick: vi.fn() }];
describe('QuickActions', () => { it('renderiza ações', () => { render(<QuickActions actions={mockActions} />); expect(screen.getByText('Nova Admissão')).toBeInTheDocument(); }); it('executa ação', () => { render(<QuickActions actions={mockActions} />); fireEvent.click(screen.getByText('Nova Admissão')); expect(mockActions[0].onClick).toHaveBeenCalled(); }); });
