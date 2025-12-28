import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CategoriaList } from '@/components/categorias/CategoriaList';
describe('CategoriaList', () => { it('renders', () => { render(<CategoriaList />); expect(true).toBe(true); }); });
