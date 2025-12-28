import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SuspensaoCard } from '@/components/suspensoes/SuspensaoCard';
describe('SuspensaoCard', () => { it('renders', () => { render(<SuspensaoCard />); expect(true).toBe(true); }); });
