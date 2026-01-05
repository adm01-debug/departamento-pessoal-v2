import type { Meta, StoryObj } from "@storybook/react";
import { LotacaoForm } from "./LotacaoForm";
const meta: Meta<typeof LotacaoForm> = { title: "Forms/LotacaoForm", component: LotacaoForm, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof LotacaoForm>;
export const Default: Story = { args: {} };
export const CentroCusto: Story = { args: { defaultValues: { codigo: "CC001", descricao: "Administrativo", tipo: "CENTRO_CUSTO", ativo: true } } };
