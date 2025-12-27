import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardFooter } from '@/components/cards/CardFooter';
describe('CardFooter', () => { it('renderiza footer', () => { render(<CardFooter>Footer</CardFooter>); expect(screen.getByText('Footer')).toBeInTheDocument(); }); });
