import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilePreview } from '@/components/upload/FilePreview';
describe('FilePreview', () => { it('renderiza preview de imagem', () => { render(<FilePreview file={{ name: 'test.jpg', type: 'image/jpeg', url: 'test.jpg' }} />); expect(screen.getByRole('img')).toBeInTheDocument(); }); it('renderiza preview de PDF', () => { render(<FilePreview file={{ name: 'test.pdf', type: 'application/pdf' }} />); expect(screen.getByText('test.pdf')).toBeInTheDocument(); }); });
