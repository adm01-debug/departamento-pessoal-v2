import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingTable } from '@/components/tables/LoadingTable';
describe('LoadingTable', () => { it('renderiza skeleton', () => { render(<LoadingTable rows={5} columns={3} />); const skeletons = screen.getAllByTestId('skeleton-row'); expect(skeletons.length).toBe(5); }); });
