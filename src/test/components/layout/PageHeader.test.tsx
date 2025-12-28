import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { PageHeader } from '@/components/layout/PageHeader';
describe('PageHeader', () => { it('renders', () => { render(<PageHeader />); }); });
