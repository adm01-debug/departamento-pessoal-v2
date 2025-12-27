import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chip } from '@/components/ui/Chip';
describe('Chip', () => { it('renderiza chip', () => { render(<Chip>Tag</Chip>); expect(screen.getByText('Tag')).toBeInTheDocument(); }); it('aplica variante', () => { const { container } = render(<Chip variant="success">OK</Chip>); expect(container.firstChild).toBeInTheDocument(); }); });
