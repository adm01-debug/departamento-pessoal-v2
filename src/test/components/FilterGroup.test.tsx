import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilterGroup } from '@/components/filters/FilterGroup';
describe('FilterGroup', () => { it('renderiza grupo', () => { render(<FilterGroup label="Grupo"><div>Item</div></FilterGroup>); expect(screen.getByText('Grupo')).toBeInTheDocument(); }); });
