import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NoData } from '@/components/feedback/NoData';
describe('NoData', () => { it('renderiza mensagem', () => { render(<NoData message="Sem dados" />); expect(screen.getByText('Sem dados')).toBeInTheDocument(); }); it('exibe ícone', () => { const { container } = render(<NoData />); expect(container.querySelector('svg')).toBeInTheDocument(); }); });
