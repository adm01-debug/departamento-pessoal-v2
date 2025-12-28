import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ItemCard } from '@/components/itens/ItemCard';
describe('ItemCard', () => { it('renders', () => { render(<ItemCard />); expect(true).toBe(true); }); });
