import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AutoSyncConfig } from '@/components/AutoSyncConfig';

describe('AutoSyncConfig', () => {
  const mockOnChange = vi.fn();

  it('renders sync configuration', () => {
    render(<AutoSyncConfig enabled={true} interval={30} onChange={mockOnChange} />);
    expect(screen.getByText(/sincronização/i)).toBeInTheDocument();
  });

  it('shows enabled state', () => {
    render(<AutoSyncConfig enabled={true} interval={30} onChange={mockOnChange} />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('shows disabled state', () => {
    render(<AutoSyncConfig enabled={false} interval={30} onChange={mockOnChange} />);
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('calls onChange when toggled', () => {
    render(<AutoSyncConfig enabled={false} interval={30} onChange={mockOnChange} />);
    fireEvent.click(screen.getByRole('switch'));
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('displays interval value', () => {
    render(<AutoSyncConfig enabled={true} interval={60} onChange={mockOnChange} />);
    expect(screen.getByText(/60/)).toBeInTheDocument();
  });
});
