import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LembreteCard } from '@/components/lembretes/LembreteCard';
describe('LembreteCard', () => { it('renders', () => { render(<LembreteCard />); expect(true).toBe(true); }); });
