import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ButtonGroup } from '@/components/buttons/ButtonGroup';
describe('ButtonGroup', () => {
  it('renderiza grupo de botões', () => { render(<ButtonGroup><button>A</button><button>B</button></ButtonGroup>); expect(screen.getByText('A')).toBeInTheDocument(); expect(screen.getByText('B')).toBeInTheDocument(); });
  it('aplica orientação', () => { const { container } = render(<ButtonGroup orientation="vertical"><button>X</button></ButtonGroup>); expect(container.firstChild).toBeInTheDocument(); });
});
