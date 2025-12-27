import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataTooltip } from '@/components/data/DataTooltip';
describe('DataTooltip', () => { it('renderiza tooltip', () => { render(<DataTooltip content="Info"><span>Hover</span></DataTooltip>); expect(screen.getByText('Hover')).toBeInTheDocument(); }); });
