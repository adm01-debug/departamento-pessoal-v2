import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { RichTextEditor } from '@/components/forms/RichTextEditor';
describe('RichTextEditor', () => { it('renders', () => { render(<RichTextEditor />); }); });
