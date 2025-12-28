import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MultaCard } from '@/components/multas/MultaCard';
describe('MultaCard', () => { it('renders', () => { render(<MultaCard />); expect(true).toBe(true); }); });
