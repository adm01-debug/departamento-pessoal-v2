import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from '@/components/ui/select';
describe('Select', () => { it('renderiza select', () => { render(<Select><option value="1">Opção 1</option></Select>); expect(screen.getByRole('combobox')).toBeInTheDocument(); }); });
