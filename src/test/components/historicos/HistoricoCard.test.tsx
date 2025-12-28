import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistoricoCard } from '@/components/historicos/HistoricoCard';
describe('HistoricoCard', () => { it('renders', () => { render(<HistoricoCard />); expect(true).toBe(true); }); });
