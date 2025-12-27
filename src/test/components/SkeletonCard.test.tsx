import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SkeletonCard } from '@/components/skeletons/SkeletonCard';
describe('SkeletonCard', () => { it('renderiza skeleton card', () => { const { container } = render(<SkeletonCard />); expect(container.firstChild).toBeInTheDocument(); }); });
