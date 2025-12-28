import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EquipamentoCard } from '@/components/equipamentos/EquipamentoCard';
describe('EquipamentoCard', () => { it('renders', () => { render(<EquipamentoCard />); expect(true).toBe(true); }); });
