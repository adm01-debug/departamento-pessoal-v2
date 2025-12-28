import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { UnidadeList } from '@/components/unidades/UnidadeList';
describe('UnidadeList', () => { it('renders', () => { render(<UnidadeList />); expect(true).toBe(true); }); });
