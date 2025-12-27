import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RecentActivities } from '@/components/dashboard/RecentActivities';
const mockActivities = [{ id: '1', action: 'Criou', entity: 'Colaborador', time: '5min' }];
describe('RecentActivities', () => { it('renderiza atividades', () => { render(<RecentActivities activities={mockActivities} />); expect(screen.getByText('Criou')).toBeInTheDocument(); }); });
