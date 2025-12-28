import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UnidadeCard } from '@/components/unidades/UnidadeCard';
describe('UnidadeCard', () => { it('renders', () => { render(<UnidadeCard />); expect(true).toBe(true); }); });
