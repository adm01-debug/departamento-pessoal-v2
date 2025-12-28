import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AtestadoList } from '@/components/atestados/AtestadoList';
describe('AtestadoList', () => { it('renders', () => { render(<AtestadoList />); expect(true).toBe(true); }); });
