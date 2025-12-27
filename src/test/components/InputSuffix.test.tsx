import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InputSuffix } from '@/components/form/InputSuffix';
describe('InputSuffix', () => { it('renderiza sufixo', () => { render(<InputSuffix>kg</InputSuffix>); expect(screen.getByText('kg')).toBeInTheDocument(); }); });
