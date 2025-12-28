import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ViagemCard } from '@/components/viagens/ViagemCard';
describe('ViagemCard', () => { it('renders', () => { render(<ViagemCard />); expect(true).toBe(true); }); });
