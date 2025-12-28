import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnexoCard } from '@/components/anexos/AnexoCard';
describe('AnexoCard', () => { it('renders', () => { render(<AnexoCard />); expect(true).toBe(true); }); });
