import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ModalContainer } from '@/components/modals/ModalContainer';
describe('ModalContainer', () => { it('renderiza container', () => { render(<ModalContainer><div>Modal</div></ModalContainer>); expect(screen.getByText('Modal')).toBeInTheDocument(); }); });
