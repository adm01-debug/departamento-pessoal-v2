import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AtestadoCard } from '@/components/atestados/AtestadoCard';
describe('AtestadoCard', () => { it('renders', () => { render(<AtestadoCard />); expect(true).toBe(true); }); });
