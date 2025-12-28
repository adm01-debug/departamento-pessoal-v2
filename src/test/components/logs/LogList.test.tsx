import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LogList } from '@/components/logs/LogList';
describe('LogList', () => { it('renders', () => { render(<LogList />); expect(true).toBe(true); }); });
