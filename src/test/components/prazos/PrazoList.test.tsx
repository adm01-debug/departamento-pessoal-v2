import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PrazoList } from '@/components/prazos/PrazoList';
describe('PrazoList', () => { it('renders', () => { render(<PrazoList />); expect(true).toBe(true); }); });
