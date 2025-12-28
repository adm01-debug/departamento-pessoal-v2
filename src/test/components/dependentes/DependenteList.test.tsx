import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DependenteList } from '@/components/dependentes/DependenteList';
describe('DependenteList', () => { it('renders', () => { render(<DependenteList />); expect(true).toBe(true); }); });
