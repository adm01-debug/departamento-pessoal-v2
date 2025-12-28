import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SetorList } from '@/components/setores/SetorList';
describe('SetorList', () => { it('renders', () => { render(<SetorList />); expect(true).toBe(true); }); });
