import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { DataGrid } from '@/components/data/DataGrid';
describe('DataGrid', () => { it('renders', () => { render(<DataGrid />); }); });
