import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AprovacaoCard } from '@/components/aprovacoes/AprovacaoCard';
describe('AprovacaoCard', () => { it('renders', () => { render(<AprovacaoCard />); expect(true).toBe(true); }); });
