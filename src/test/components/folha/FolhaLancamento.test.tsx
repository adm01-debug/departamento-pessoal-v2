import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FolhaLancamento } from '@/components/folha/FolhaLancamento';
describe('FolhaLancamento', () => { it('renders', () => { render(<FolhaLancamento />); }); });
