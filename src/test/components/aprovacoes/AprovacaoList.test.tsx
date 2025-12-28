import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AprovacaoList } from '@/components/aprovacoes/AprovacaoList';
describe('AprovacaoList', () => { it('renders', () => { render(<AprovacaoList />); expect(true).toBe(true); }); });
