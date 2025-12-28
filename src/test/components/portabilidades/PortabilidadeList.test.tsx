import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PortabilidadeList } from '@/components/portabilidades/PortabilidadeList';
describe('PortabilidadeList', () => { it('renders', () => { render(<PortabilidadeList />); expect(true).toBe(true); }); });
