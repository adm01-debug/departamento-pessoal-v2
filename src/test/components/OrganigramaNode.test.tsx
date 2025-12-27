import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OrganigramaNode } from '@/components/organograma/OrganigramaNode';
const mockNode = { id: '1', nome: 'CEO', cargo: 'Diretor' };
describe('OrganigramaNode', () => { it('renderiza node', () => { render(<OrganigramaNode node={mockNode} />); expect(screen.getByText('CEO')).toBeInTheDocument(); }); });
