import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EntrevistaCard } from '@/components/entrevistas/EntrevistaCard';
describe('EntrevistaCard', () => { it('renders', () => { render(<EntrevistaCard />); expect(true).toBe(true); }); });
