import type { Meta, StoryObj } from '@storybook/react';
import { JornadaList } from './JornadaList';
const meta: Meta<typeof JornadaList> = { title: 'Jornada/JornadaList', component: JornadaList, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof JornadaList>;
const mockJornadas = [{ id: '1', codigo: 'JOR001', descricao: 'Comercial 8h', horaInicio: '08:00', horaFim: '18:00', cargaHorariaDiaria: 8, tipo: 'NORMAL', diasSemana: [1,2,3,4,5], ativo: true }, { id: '2', codigo: 'JOR002', descricao: 'Escala 12x36', horaInicio: '07:00', horaFim: '19:00', cargaHorariaDiaria: 12, tipo: 'ESCALA', diasSemana: [1,3,5], ativo: true }];
export const Default: Story = { args: { jornadas: mockJornadas, isLoading: false } };
export const Loading: Story = { args: { jornadas: [], isLoading: true } };
export const Empty: Story = { args: { jornadas: [], isLoading: false } };
