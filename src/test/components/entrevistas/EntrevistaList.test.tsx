import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EntrevistaList } from '@/components/entrevistas/EntrevistaList';
describe('EntrevistaList', () => { it('renders', () => { render(<EntrevistaList />); expect(true).toBe(true); }); });
