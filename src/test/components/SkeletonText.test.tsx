import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonText } from '@/components/skeletons/SkeletonText';
describe('SkeletonText', () => { it('renderiza skeleton texto', () => { const { container } = render(<SkeletonText />); expect(container.firstChild).toBeInTheDocument(); }); it('aplica linhas', () => { const { container } = render(<SkeletonText lines={3} />); expect(container.firstChild).toBeInTheDocument(); }); });
