import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WelcomeCard } from '@/components/dashboard/WelcomeCard';
describe('WelcomeCard', () => { it('renderiza boas-vindas', () => { render(<WelcomeCard userName="João" />); expect(screen.getByText(/João/)).toBeInTheDocument(); }); });
