import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ImageUpload } from '@/components/forms/ImageUpload';
describe('ImageUpload', () => { it('renders', () => { render(<ImageUpload />); }); });
