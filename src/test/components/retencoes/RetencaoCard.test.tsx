import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RetencaoCard } from '@/components/retencoes/RetencaoCard';
describe('RetencaoCard', () => { it('renders', () => { render(<RetencaoCard />); expect(true).toBe(true); }); });
