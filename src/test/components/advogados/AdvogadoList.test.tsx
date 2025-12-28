import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdvogadoList } from '@/components/advogados/AdvogadoList';
describe('AdvogadoList', () => { it('renders', () => { render(<AdvogadoList />); expect(true).toBe(true); }); });
