import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
describe('OnboardingWizard', () => { it('renderiza wizard', () => { render(<OnboardingWizard onComplete={vi.fn()} />); expect(screen.getByText(/próximo/i)).toBeInTheDocument(); }); });
