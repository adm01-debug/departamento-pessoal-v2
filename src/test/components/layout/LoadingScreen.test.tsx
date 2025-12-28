import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
describe('LoadingScreen', () => { it('renders', () => { render(<LoadingScreen />); }); });
