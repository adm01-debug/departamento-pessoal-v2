import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ElogioCard } from '@/components/elogios/ElogioCard';
describe('ElogioCard', () => { it('renders', () => { render(<ElogioCard />); expect(true).toBe(true); }); });
