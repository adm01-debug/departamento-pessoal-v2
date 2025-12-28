import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { EmptyState } from '@/components/layout/EmptyState';
describe('EmptyState', () => { it('renders', () => { render(<EmptyState />); }); });
