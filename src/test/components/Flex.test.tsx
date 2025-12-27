import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flex } from '@/components/layout/Flex';
describe('Flex', () => { it('renderiza flex', () => { render(<Flex>Content</Flex>); expect(screen.getByText('Content')).toBeInTheDocument(); }); it('aplica direção', () => { const { container } = render(<Flex direction="column">Col</Flex>); expect(container.firstChild).toBeInTheDocument(); }); it('aplica gap', () => { const { container } = render(<Flex gap={4}>Gap</Flex>); expect(container.firstChild).toBeInTheDocument(); }); });
