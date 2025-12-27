import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CalendarioFerias } from '@/components/ferias/CalendarioFerias';
const mockFerias = [{ id: '1', colaborador: 'Maria', inicio: '2025-02-01', fim: '2025-02-15' }];
describe('CalendarioFerias', () => {
  it('renderiza férias', () => { render(<CalendarioFerias ferias={mockFerias} />); expect(screen.getByText('Maria')).toBeInTheDocument(); });
});
