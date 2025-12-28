import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FrotaCard } from '@/components/frotas/FrotaCard';
describe('FrotaCard', () => { it('renders', () => { render(<FrotaCard />); expect(true).toBe(true); }); });
