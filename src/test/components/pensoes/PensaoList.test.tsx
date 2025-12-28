import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PensaoList } from '@/components/pensoes/PensaoList';
describe('PensaoList', () => { it('renders', () => { render(<PensaoList />); expect(true).toBe(true); }); });
