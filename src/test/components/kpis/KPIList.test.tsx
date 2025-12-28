import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KPIList } from '@/components/kpis/KPIList';
describe('KPIList', () => { it('renders', () => { render(<KPIList />); expect(true).toBe(true); }); });
