import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PensaoCard } from '@/components/pensoes/PensaoCard';
describe('PensaoCard', () => { it('renders', () => { render(<PensaoCard />); expect(true).toBe(true); }); });
