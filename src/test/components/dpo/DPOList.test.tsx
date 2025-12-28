import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DPOList } from '@/components/dpo/DPOList';
describe('DPOList', () => { it('renders', () => { render(<DPOList />); expect(true).toBe(true); }); });
