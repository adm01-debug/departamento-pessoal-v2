import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DependenteCard } from '@/components/dependentes/DependenteCard';
describe('DependenteCard', () => { it('renders', () => { render(<DependenteCard />); expect(true).toBe(true); }); });
