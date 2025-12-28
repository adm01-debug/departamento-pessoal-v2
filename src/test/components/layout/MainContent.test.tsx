import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { MainContent } from '@/components/layout/MainContent';
describe('MainContent', () => { it('renders', () => { render(<MainContent />); }); });
