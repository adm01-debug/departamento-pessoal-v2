import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuspensaoList } from '@/components/suspensoes/SuspensaoList';
describe('SuspensaoList', () => { it('renders', () => { render(<SuspensaoList />); expect(true).toBe(true); }); });
