import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TermoCard } from '@/components/termos/TermoCard';
describe('TermoCard', () => { it('renders', () => { render(<TermoCard />); expect(true).toBe(true); }); });
