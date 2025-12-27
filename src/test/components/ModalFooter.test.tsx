import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ModalFooter } from '@/components/modals/ModalFooter';
describe('ModalFooter', () => { it('renderiza footer', () => { render(<ModalFooter><button>OK</button></ModalFooter>); expect(screen.getByText('OK')).toBeInTheDocument(); }); });
