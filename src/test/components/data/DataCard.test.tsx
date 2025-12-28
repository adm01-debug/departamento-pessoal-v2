import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { DataCard } from '@/components/data/DataCard';
describe('DataCard', () => { it('renders', () => { render(<DataCard />); }); });
