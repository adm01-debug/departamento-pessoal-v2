import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IndicatorAlertsCard } from '@/components/dashboard/IndicatorAlertsCard';
const mockAlerts = [{ id: '1', message: 'Férias vencendo', type: 'warning' }];
describe('IndicatorAlertsCard', () => { it('renderiza alertas', () => { render(<IndicatorAlertsCard alerts={mockAlerts} />); expect(screen.getByText('Férias vencendo')).toBeInTheDocument(); }); });
