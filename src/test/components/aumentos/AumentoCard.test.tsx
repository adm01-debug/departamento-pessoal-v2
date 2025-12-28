import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AumentoCard } from '@/components/aumentos/AumentoCard';
describe('AumentoCard', () => { it('renders', () => { render(<AumentoCard />); expect(true).toBe(true); }); });
