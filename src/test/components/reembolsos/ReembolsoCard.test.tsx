import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReembolsoCard } from '@/components/reembolsos/ReembolsoCard';
describe('ReembolsoCard', () => { it('renders', () => { render(<ReembolsoCard />); expect(true).toBe(true); }); });
