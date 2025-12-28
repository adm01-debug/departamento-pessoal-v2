import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { StatusFilter } from '@/components/filters/StatusFilter';
describe('StatusFilter', () => { it('renders', () => { render(<StatusFilter />); }); });
