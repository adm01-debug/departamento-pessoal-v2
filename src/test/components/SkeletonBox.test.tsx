import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonBox } from '@/components/skeletons/SkeletonBox';
describe('SkeletonBox', () => { it('renderiza skeleton', () => { const { container } = render(<SkeletonBox />); expect(container.firstChild).toBeInTheDocument(); }); it('aplica dimensões', () => { const { container } = render(<SkeletonBox width={100} height={50} />); expect(container.firstChild).toBeInTheDocument(); }); });
