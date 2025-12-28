import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FluxoCard } from '@/components/fluxos/FluxoCard';
describe('FluxoCard', () => { it('renders', () => { render(<FluxoCard />); expect(true).toBe(true); }); });
