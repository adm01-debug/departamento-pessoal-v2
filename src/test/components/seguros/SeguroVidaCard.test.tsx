import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SeguroVidaCard } from '@/components/seguros/SeguroVidaCard';
describe('SeguroVidaCard', () => { it('renders', () => { render(<SeguroVidaCard />); expect(true).toBe(true); }); });
