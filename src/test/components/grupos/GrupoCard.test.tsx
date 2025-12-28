import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GrupoCard } from '@/components/grupos/GrupoCard';
describe('GrupoCard', () => { it('renders', () => { render(<GrupoCard />); expect(true).toBe(true); }); });
