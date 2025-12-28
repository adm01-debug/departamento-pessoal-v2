import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { CargoCard } from '@/components/cargo/CargoCard';
describe('CargoCard', () => { it('renders', () => { render(<CargoCard />); }); });
