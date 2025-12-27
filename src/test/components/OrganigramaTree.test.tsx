import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrganigramaTree } from '@/components/organograma/OrganigramaTree';
const mockData = { id: '1', nome: 'CEO', children: [] };
describe('OrganigramaTree', () => { it('renderiza árvore', () => { render(<OrganigramaTree data={mockData} />); expect(screen.getByText('CEO')).toBeInTheDocument(); }); });
