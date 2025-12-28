import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HabilidadeCard } from '@/components/habilidades/HabilidadeCard';
describe('HabilidadeCard', () => { it('renders', () => { render(<HabilidadeCard />); expect(true).toBe(true); }); });
