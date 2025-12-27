import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar } from '@/components/feedback/ProgressBar';
describe('ProgressBar', () => { it('renderiza barra', () => { render(<ProgressBar value={60} max={100} />); expect(screen.getByRole('progressbar')).toBeInTheDocument(); }); it('exibe label', () => { render(<ProgressBar value={60} max={100} showLabel />); expect(screen.getByText('60%')).toBeInTheDocument(); }); });
