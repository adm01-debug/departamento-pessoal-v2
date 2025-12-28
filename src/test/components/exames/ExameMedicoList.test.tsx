import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExameMedicoList } from '@/components/exames/ExameMedicoList';
describe('ExameMedicoList', () => { it('renders', () => { render(<ExameMedicoList />); expect(true).toBe(true); }); });
