import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HabilidadeList } from '@/components/habilidades/HabilidadeList';
describe('HabilidadeList', () => { it('renders', () => { render(<HabilidadeList />); expect(true).toBe(true); }); });
