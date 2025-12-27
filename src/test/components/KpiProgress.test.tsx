import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KpiProgress } from '@/components/kpi/KpiProgress';
describe('KpiProgress', () => { it('renderiza progresso', () => { render(<KpiProgress value={75} max={100} label="Meta" />); expect(screen.getByText('Meta')).toBeInTheDocument(); expect(screen.getByText('75%')).toBeInTheDocument(); }); });
