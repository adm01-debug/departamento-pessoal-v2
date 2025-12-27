import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CardImage } from '@/components/cards/CardImage';
describe('CardImage', () => { it('renderiza imagem', () => { render(<CardImage src="test.jpg" alt="Test" />); expect(screen.getByRole('img')).toBeInTheDocument(); }); });
