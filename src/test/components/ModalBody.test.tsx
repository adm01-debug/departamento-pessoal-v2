import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ModalBody } from '@/components/modals/ModalBody';
describe('ModalBody', () => { it('renderiza corpo', () => { render(<ModalBody>Corpo do modal</ModalBody>); expect(screen.getByText('Corpo do modal')).toBeInTheDocument(); }); });
