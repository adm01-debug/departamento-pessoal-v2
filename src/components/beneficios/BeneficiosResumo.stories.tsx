import type { Meta, StoryObj } from "@storybook/react";
import { BeneficiosResumo } from "./BeneficiosResumo";
const meta: Meta<typeof BeneficiosResumo> = { title: "Beneficios/BeneficiosResumo", component: BeneficiosResumo };
export default meta;
type Story = StoryObj<typeof BeneficiosResumo>;
export const Default: Story = { args: { beneficios: [{ nome: "Plano Saúde", tipo: "Saúde", beneficiarios: 120, totalBeneficiarios: 150, custoMensal: 45000 }, { nome: "Vale Refeição", tipo: "Alimentação", beneficiarios: 150, totalBeneficiarios: 150, custoMensal: 28000 }], custoTotal: 85000 } };
