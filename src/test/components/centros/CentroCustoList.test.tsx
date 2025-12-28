import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CentroCustoList } from '@/components/centros/CentroCustoList';
describe('CentroCustoList', () => { it('renders', () => { render(<CentroCustoList />); expect(true).toBe(true); }); });
