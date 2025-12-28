import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ItemList } from '@/components/itens/ItemList';
describe('ItemList', () => { it('renders', () => { render(<ItemList />); expect(true).toBe(true); }); });
