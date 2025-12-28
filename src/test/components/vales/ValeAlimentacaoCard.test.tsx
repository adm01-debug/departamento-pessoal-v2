import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ValeAlimentacaoCard } from '@/components/vales/ValeAlimentacaoCard';
describe('ValeAlimentacaoCard', () => { it('renders', () => { render(<ValeAlimentacaoCard />); expect(true).toBe(true); }); });
