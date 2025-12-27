import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DropZone } from '@/components/upload/DropZone';
describe('DropZone', () => { it('renderiza dropzone', () => { render(<DropZone onDrop={vi.fn()} />); expect(screen.getByText(/arraste/i)).toBeInTheDocument(); }); });
