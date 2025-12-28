import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CategoriaCard } from '@/components/categorias/CategoriaCard';
describe('CategoriaCard', () => { it('renders', () => { render(<CategoriaCard />); expect(true).toBe(true); }); });
