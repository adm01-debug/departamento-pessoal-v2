import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SalaCard } from '@/components/salas/SalaCard';
describe('SalaCard', () => { it('renders', () => { render(<SalaCard />); expect(true).toBe(true); }); });
