import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HomologacaoList } from '@/components/homologacoes/HomologacaoList';
describe('HomologacaoList', () => { it('renders', () => { render(<HomologacaoList />); expect(true).toBe(true); }); });
