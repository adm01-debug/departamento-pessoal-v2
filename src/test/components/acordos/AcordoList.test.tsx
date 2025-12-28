import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AcordoList } from '@/components/acordos/AcordoList';
describe('AcordoList', () => { it('renders', () => { render(<AcordoList />); expect(true).toBe(true); }); });
