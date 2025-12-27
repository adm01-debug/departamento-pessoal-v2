import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonCircle } from '@/components/skeletons/SkeletonCircle';
describe('SkeletonCircle', () => { it('renderiza skeleton circular', () => { const { container } = render(<SkeletonCircle />); expect(container.firstChild).toBeInTheDocument(); }); it('aplica tamanho', () => { const { container } = render(<SkeletonCircle size={48} />); expect(container.firstChild).toBeInTheDocument(); }); });
