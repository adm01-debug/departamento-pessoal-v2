import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { PageContainer } from '@/components/layout/PageContainer';
describe('PageContainer', () => { it('renders', () => { render(<PageContainer />); }); });
