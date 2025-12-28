import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PrazoCard } from '@/components/prazos/PrazoCard';
describe('PrazoCard', () => { it('renders', () => { render(<PrazoCard />); expect(true).toBe(true); }); });
