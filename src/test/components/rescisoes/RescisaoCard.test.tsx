import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RescisaoCard } from '@/components/rescisoes/RescisaoCard';
describe('RescisaoCard', () => { it('renders', () => { render(<RescisaoCard />); expect(true).toBe(true); }); });
