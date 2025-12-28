import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IndicadorList } from '@/components/indicadores/IndicadorList';
describe('IndicadorList', () => { it('renders', () => { render(<IndicadorList />); expect(true).toBe(true); }); });
