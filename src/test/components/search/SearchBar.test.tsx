import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { SearchBar } from '@/components/search/SearchBar';
describe('SearchBar', () => { it('renders', () => { render(<SearchBar />); }); });
