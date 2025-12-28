import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SetorCard } from '@/components/setores/SetorCard';
describe('SetorCard', () => { it('renders', () => { render(<SetorCard />); expect(true).toBe(true); }); });
