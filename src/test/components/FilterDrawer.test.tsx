import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FilterDrawer } from '@/components/filters/FilterDrawer';
describe('FilterDrawer', () => { it('renderiza drawer', () => { render(<FilterDrawer isOpen onClose={vi.fn()}><div>Filtros</div></FilterDrawer>); expect(screen.getByText('Filtros')).toBeInTheDocument(); }); it('fecha drawer', () => { const onClose = vi.fn(); render(<FilterDrawer isOpen onClose={onClose}><div>X</div></FilterDrawer>); fireEvent.click(screen.getByText(/fechar/i)); expect(onClose).toHaveBeenCalled(); }); });
