import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetaList } from '@/components/metas/MetaList';
describe('MetaList', () => { it('renders', () => { render(<MetaList />); expect(true).toBe(true); }); });
