import type { Meta, StoryObj } from "@storybook/react";
import { BeneficioCard } from "./BeneficioCard";
const meta: Meta<typeof BeneficioCard> = { title: "Beneficios/BeneficioCard", component: BeneficioCard };
export default meta;
type Story = StoryObj<typeof BeneficioCard>;
export const Ativo: Story = { args: { beneficio: { id: "1", nome: "Plano Saúde", tipo: "Saúde", descricao: "Unimed Nacional", valor: 500, beneficiarios: 120, ativo: true } } };
export const Inativo: Story = { args: { beneficio: { id: "2", nome: "Auxílio Creche", tipo: "Assistencial", beneficiarios: 15, ativo: false } } };
