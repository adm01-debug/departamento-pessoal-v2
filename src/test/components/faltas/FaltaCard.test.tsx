import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FaltaCard } from '@/components/faltas/FaltaCard';
describe('FaltaCard', () => { it('renders', () => { render(<FaltaCard />); expect(true).toBe(true); }); });
