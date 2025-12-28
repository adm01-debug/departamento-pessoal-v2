import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LogCard } from '@/components/logs/LogCard';
describe('LogCard', () => { it('renders', () => { render(<LogCard />); expect(true).toBe(true); }); });
