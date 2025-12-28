import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LocalCard } from '@/components/locais/LocalCard';
describe('LocalCard', () => { it('renders', () => { render(<LocalCard />); expect(true).toBe(true); }); });
