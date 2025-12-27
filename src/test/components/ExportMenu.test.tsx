import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExportMenu } from '@/components/export/ExportMenu';
describe('ExportMenu', () => { it('renderiza menu', () => { render(<ExportMenu onExport={vi.fn()} />); expect(screen.getByText(/exportar/i)).toBeInTheDocument(); }); });
