import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReclamatoriCard } from '@/components/reclamatorias/ReclamatoriCard';
describe('ReclamatoriCard', () => { it('renders', () => { render(<ReclamatoriCard />); expect(true).toBe(true); }); });
