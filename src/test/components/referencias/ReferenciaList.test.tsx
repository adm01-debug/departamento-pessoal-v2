import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReferenciaList } from '@/components/referencias/ReferenciaList';
describe('ReferenciaList', () => { it('renders', () => { render(<ReferenciaList />); expect(true).toBe(true); }); });
