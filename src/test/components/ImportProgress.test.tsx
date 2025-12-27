import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImportProgress } from '@/components/import/ImportProgress';
describe('ImportProgress', () => { it('renderiza progresso', () => { render(<ImportProgress current={50} total={100} />); expect(screen.getByText(/50/)).toBeInTheDocument(); }); it('exibe percentual', () => { render(<ImportProgress current={50} total={100} showPercent />); expect(screen.getByText(/50%/)).toBeInTheDocument(); }); });
