import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
describe('OnboardingProgress', () => { it('renderiza progresso', () => { render(<OnboardingProgress currentStep={2} totalSteps={5} />); expect(screen.getByText('2/5')).toBeInTheDocument(); }); });
