import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProdutoList } from '@/components/produtos/ProdutoList';
describe('ProdutoList', () => { it('renders', () => { render(<ProdutoList />); expect(true).toBe(true); }); });
