import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CustomIcon } from '@/components/icons/CustomIcon';
describe('CustomIcon', () => { it('renderiza ícone', () => { const { container } = render(<CustomIcon name="user" />); expect(container.querySelector('svg')).toBeInTheDocument(); }); it('aplica tamanho', () => { const { container } = render(<CustomIcon name="edit" size={24} />); expect(container.firstChild).toBeInTheDocument(); }); });
