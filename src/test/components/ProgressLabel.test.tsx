import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressLabel } from '@/components/feedback/ProgressLabel';
describe('ProgressLabel', () => { it('renderiza label', () => { render(<ProgressLabel>Carregando...</ProgressLabel>); expect(screen.getByText('Carregando...')).toBeInTheDocument(); }); });
