import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProdutoCard } from '@/components/produtos/ProdutoCard';
describe('ProdutoCard', () => { it('renders', () => { render(<ProdutoCard />); expect(true).toBe(true); }); });
