import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { KPICard } from '@/components/data/KPICard';
describe('KPICard', () => { it('renders', () => { render(<KPICard />); }); });
