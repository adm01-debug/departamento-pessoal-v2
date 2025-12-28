import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CentroCustoCard } from '@/components/centros/CentroCustoCard';
describe('CentroCustoCard', () => { it('renders', () => { render(<CentroCustoCard />); expect(true).toBe(true); }); });
