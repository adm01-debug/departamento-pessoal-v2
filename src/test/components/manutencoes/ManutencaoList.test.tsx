import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ManutencaoList } from '@/components/manutencoes/ManutencaoList';
describe('ManutencaoList', () => { it('renders', () => { render(<ManutencaoList />); expect(true).toBe(true); }); });
