import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AumentoList } from '@/components/aumentos/AumentoList';
describe('AumentoList', () => { it('renders', () => { render(<AumentoList />); expect(true).toBe(true); }); });
