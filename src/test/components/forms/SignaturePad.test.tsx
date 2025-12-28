import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { SignaturePad } from '@/components/forms/SignaturePad';
describe('SignaturePad', () => { it('renders', () => { render(<SignaturePad />); }); });
