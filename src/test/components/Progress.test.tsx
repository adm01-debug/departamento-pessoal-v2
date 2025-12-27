import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Progress } from '@/components/ui/progress';
describe('Progress', () => { it('renderiza progresso', () => { render(<Progress value={50} />); expect(screen.getByRole('progressbar')).toBeInTheDocument(); }); it('exibe valor', () => { render(<Progress value={75} />); expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75'); }); });
