import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ErrorPage } from '@/components/layout/ErrorPage';
describe('ErrorPage', () => { it('renders', () => { render(<ErrorPage />); }); });
