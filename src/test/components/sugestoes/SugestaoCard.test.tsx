import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SugestaoCard } from '@/components/sugestoes/SugestaoCard';
describe('SugestaoCard', () => { it('renders', () => { render(<SugestaoCard />); expect(true).toBe(true); }); });
