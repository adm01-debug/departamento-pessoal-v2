import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { SavedFilters } from '@/components/filters/SavedFilters';
describe('SavedFilters', () => { it('renders', () => { render(<SavedFilters />); }); });
