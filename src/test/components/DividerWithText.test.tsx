import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DividerWithText } from '@/components/layout/DividerWithText';
describe('DividerWithText', () => { it('renderiza divisor com texto', () => { render(<DividerWithText>OU</DividerWithText>); expect(screen.getByText('OU')).toBeInTheDocument(); }); });
