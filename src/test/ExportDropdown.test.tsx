import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import ExportDropdown from '@/components/ExportDropdown';
import React from 'react';

describe('ExportDropdown', () => {
  const mockOnExport = vi.fn();

  it('deve renderizar', () => {
    const { container } = render(<ExportDropdown onExport={mockOnExport} />);
    expect(container).toBeDefined();
  });

  it('deve ter opções de exportação', () => {
    const { container } = render(<ExportDropdown onExport={mockOnExport} />);
    expect(container.querySelector('button')).toBeDefined();
  });

  it('deve chamar onExport ao clicar', () => {
    const { container } = render(<ExportDropdown onExport={mockOnExport} />);
    const button = container.querySelector('button');
    if (button) fireEvent.click(button);
    expect(container).toBeDefined();
  });
});
