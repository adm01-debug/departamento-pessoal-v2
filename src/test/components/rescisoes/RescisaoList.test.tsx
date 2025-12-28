import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RescisaoList } from '@/components/rescisoes/RescisaoList';
describe('RescisaoList', () => { it('renders', () => { render(<RescisaoList />); expect(true).toBe(true); }); });
