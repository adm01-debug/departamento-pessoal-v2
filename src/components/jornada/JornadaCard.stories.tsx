import type { Meta, StoryObj } from '@storybook/react';
import { JornadaCard } from './JornadaCard';
const meta: Meta<typeof JornadaCard> = { title: 'Jornada/JornadaCard', component: JornadaCard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof JornadaCard>;
export const Default: Story = { args: { jornada: { id: '1', codigo: 'JOR001', descricao: 'Comercial', horaInicio: '08:00', horaFim: '18:00', cargaHorariaDiaria: 8, tipo: 'NORMAL', diasSemana: [1,2,3,4,5], toleranciaEntrada: 10, toleranciaSaida: 10, permiteHoraExtra: true, permiteBancoHoras: false, ativo: true } } };
export const Escala: Story = { args: { jornada: { id: '2', codigo: 'JOR002', descricao: '12x36', horaInicio: '07:00', horaFim: '19:00', cargaHorariaDiaria: 12, tipo: 'ESCALA', diasSemana: [1,3,5], toleranciaEntrada: 5, toleranciaSaida: 5, permiteHoraExtra: false, permiteBancoHoras: true, ativo: true } } };
