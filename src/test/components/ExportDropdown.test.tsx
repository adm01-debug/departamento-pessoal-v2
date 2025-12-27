import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportDropdown } from '@/components/ExportDropdown';

describe('ExportDropdown', () => {
  const mockOnExport = vi.fn();

  it('renders export button', () => {
    render(<ExportDropdown onExport={mockOnExport} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows dropdown options on click', () => {
    render(<ExportDropdown onExport={mockOnExport} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText(/PDF/i)).toBeInTheDocument();
    expect(screen.getByText(/Excel/i)).toBeInTheDocument();
  });

  it('calls onExport with PDF format', () => {
    render(<ExportDropdown onExport={mockOnExport} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText(/PDF/i));
    expect(mockOnExport).toHaveBeenCalledWith('pdf');
  });

  it('calls onExport with Excel format', () => {
    render(<ExportDropdown onExport={mockOnExport} />);
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText(/Excel/i));
    expect(mockOnExport).toHaveBeenCalledWith('excel');
  });

  it('disables when loading', () => {
    render(<ExportDropdown onExport={mockOnExport} loading />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
