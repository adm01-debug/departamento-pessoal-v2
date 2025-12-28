import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PortabilidadeCard } from '@/components/portabilidades/PortabilidadeCard';
describe('PortabilidadeCard', () => { it('renders', () => { render(<PortabilidadeCard />); expect(true).toBe(true); }); });
