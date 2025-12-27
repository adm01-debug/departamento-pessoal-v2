import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmployeeStatusCard } from '@/components/dashboard/EmployeeStatusCard';
describe('EmployeeStatusCard', () => { it('renderiza card', () => { render(<EmployeeStatusCard ativos={100} inativos={10} ferias={5} />); expect(screen.getByText('100')).toBeInTheDocument(); }); });
