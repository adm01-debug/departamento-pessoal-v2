import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AvaliacaoList } from '@/components/avaliacoes/AvaliacaoList';
describe('AvaliacaoList', () => { it('renders', () => { render(<AvaliacaoList />); expect(true).toBe(true); }); });
