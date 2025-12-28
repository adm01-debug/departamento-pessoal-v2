import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DPOCard } from '@/components/dpo/DPOCard';
describe('DPOCard', () => { it('renders', () => { render(<DPOCard />); expect(true).toBe(true); }); });
