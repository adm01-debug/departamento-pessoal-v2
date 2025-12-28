import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExclusaoList } from '@/components/exclusoes/ExclusaoList';
describe('ExclusaoList', () => { it('renders', () => { render(<ExclusaoList />); expect(true).toBe(true); }); });
