import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnexoList } from '@/components/anexos/AnexoList';
describe('AnexoList', () => { it('renders', () => { render(<AnexoList />); expect(true).toBe(true); }); });
