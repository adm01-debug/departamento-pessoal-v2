import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PromocaoCard } from '@/components/promocoes/PromocaoCard';
describe('PromocaoCard', () => { it('renders', () => { render(<PromocaoCard />); expect(true).toBe(true); }); });
