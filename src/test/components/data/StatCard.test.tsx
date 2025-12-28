import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { StatCard } from '@/components/data/StatCard';
describe('StatCard', () => { it('renders', () => { render(<StatCard />); }); });
