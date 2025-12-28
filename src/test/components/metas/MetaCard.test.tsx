import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MetaCard } from '@/components/metas/MetaCard';
describe('MetaCard', () => { it('renders', () => { render(<MetaCard />); expect(true).toBe(true); }); });
