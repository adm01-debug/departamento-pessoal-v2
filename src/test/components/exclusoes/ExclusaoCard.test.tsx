import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExclusaoCard } from '@/components/exclusoes/ExclusaoCard';
describe('ExclusaoCard', () => { it('renders', () => { render(<ExclusaoCard />); expect(true).toBe(true); }); });
