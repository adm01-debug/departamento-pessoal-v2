import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProvisaoCard } from '@/components/provisoes/ProvisaoCard';
describe('ProvisaoCard', () => { it('renders', () => { render(<ProvisaoCard />); expect(true).toBe(true); }); });
