import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AtrasoList } from '@/components/atrasos/AtrasoList';
describe('AtrasoList', () => { it('renders', () => { render(<AtrasoList />); expect(true).toBe(true); }); });
