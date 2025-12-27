import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WizardContainer } from '@/components/wizard/WizardContainer';
describe('WizardContainer', () => { it('renderiza wizard', () => { render(<WizardContainer><div>Step 1</div></WizardContainer>); expect(screen.getByText('Step 1')).toBeInTheDocument(); }); });
