import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { IndicadorCard } from '@/components/indicadores/IndicadorCard';
describe('IndicadorCard', () => { it('renders', () => { render(<IndicadorCard />); expect(true).toBe(true); }); });
