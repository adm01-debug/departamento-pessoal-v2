import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
describe('OnboardingStep', () => { it('renderiza step', () => { render(<OnboardingStep title="Passo 1" description="Descrição"><div>Content</div></OnboardingStep>); expect(screen.getByText('Passo 1')).toBeInTheDocument(); }); });
