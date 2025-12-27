import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Tooltip } from '@/components/ui/tooltip';
describe('Tooltip', () => { it('renderiza tooltip', () => { render(<Tooltip content="Dica"><span>Hover</span></Tooltip>); expect(screen.getByText('Hover')).toBeInTheDocument(); }); });
