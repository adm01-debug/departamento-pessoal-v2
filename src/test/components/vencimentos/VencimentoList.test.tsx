import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VencimentoList } from '@/components/vencimentos/VencimentoList';
describe('VencimentoList', () => { it('renders', () => { render(<VencimentoList />); expect(true).toBe(true); }); });
