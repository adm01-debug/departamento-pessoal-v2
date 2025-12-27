import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressCircle } from '@/components/feedback/ProgressCircle';
describe('ProgressCircle', () => { it('renderiza círculo', () => { render(<ProgressCircle value={75} />); expect(screen.getByText('75%')).toBeInTheDocument(); }); });
