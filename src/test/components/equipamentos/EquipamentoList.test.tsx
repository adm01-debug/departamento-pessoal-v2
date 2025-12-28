import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EquipamentoList } from '@/components/equipamentos/EquipamentoList';
describe('EquipamentoList', () => { it('renders', () => { render(<EquipamentoList />); expect(true).toBe(true); }); });
