import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusIcon } from '@/components/icons/StatusIcon';
describe('StatusIcon', () => { it('renderiza ícone sucesso', () => { const { container } = render(<StatusIcon status="success" />); expect(container.querySelector('svg')).toBeInTheDocument(); }); it('renderiza ícone erro', () => { const { container } = render(<StatusIcon status="error" />); expect(container.querySelector('svg')).toBeInTheDocument(); }); });
