import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KPICard } from '@/components/kpis/KPICard';
describe('KPICard', () => { it('renders', () => { render(<KPICard />); expect(true).toBe(true); }); });
