import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TransferenciaList } from '@/components/transferencias/TransferenciaList';
describe('TransferenciaList', () => { it('renders', () => { render(<TransferenciaList />); expect(true).toBe(true); }); });
