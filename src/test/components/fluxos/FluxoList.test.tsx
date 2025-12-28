import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FluxoList } from '@/components/fluxos/FluxoList';
describe('FluxoList', () => { it('renders', () => { render(<FluxoList />); expect(true).toBe(true); }); });
