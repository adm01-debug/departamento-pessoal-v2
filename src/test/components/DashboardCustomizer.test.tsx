import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DashboardCustomizer } from '@/components/dashboard/DashboardCustomizer';
describe('DashboardCustomizer', () => { it('renderiza customizador', () => { render(<DashboardCustomizer widgets={[]} onSave={vi.fn()} />); expect(screen.getByText(/personalizar/i)).toBeInTheDocument(); }); });
