import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExportOptions } from '@/components/export/ExportOptions';
describe('ExportOptions', () => { it('renderiza opções', () => { render(<ExportOptions formats={['pdf', 'excel', 'csv']} />); expect(screen.getByText('PDF')).toBeInTheDocument(); expect(screen.getByText('Excel')).toBeInTheDocument(); }); });
