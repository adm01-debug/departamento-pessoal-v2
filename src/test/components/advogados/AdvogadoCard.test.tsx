import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AdvogadoCard } from '@/components/advogados/AdvogadoCard';
describe('AdvogadoCard', () => { it('renders', () => { render(<AdvogadoCard />); expect(true).toBe(true); }); });
