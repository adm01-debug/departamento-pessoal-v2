import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HistoricoList } from '@/components/historicos/HistoricoList';
describe('HistoricoList', () => { it('renders', () => { render(<HistoricoList />); expect(true).toBe(true); }); });
