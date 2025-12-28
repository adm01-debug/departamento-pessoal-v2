import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GrupoList } from '@/components/grupos/GrupoList';
describe('GrupoList', () => { it('renders', () => { render(<GrupoList />); expect(true).toBe(true); }); });
