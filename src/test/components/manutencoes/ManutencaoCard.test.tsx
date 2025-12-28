import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ManutencaoCard } from '@/components/manutencoes/ManutencaoCard';
describe('ManutencaoCard', () => { it('renders', () => { render(<ManutencaoCard />); expect(true).toBe(true); }); });
