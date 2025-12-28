import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProcessoList } from '@/components/processos/ProcessoList';
describe('ProcessoList', () => { it('renders', () => { render(<ProcessoList />); expect(true).toBe(true); }); });
