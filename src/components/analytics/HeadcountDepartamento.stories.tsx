import type { Meta, StoryObj } from "@storybook/react";
import { HeadcountDepartamento } from "./HeadcountDepartamento";
const meta: Meta<typeof HeadcountDepartamento> = { title: "Analytics/HeadcountDepartamento", component: HeadcountDepartamento };
export default meta;
type Story = StoryObj<typeof HeadcountDepartamento>;
export const Default: Story = { args: { data: [{ departamento: "TI", colaboradores: 45, custo: 300000, percentual: 30 }, { departamento: "RH", colaboradores: 15, custo: 90000, percentual: 10 }, { departamento: "Comercial", colaboradores: 60, custo: 400000, percentual: 40 }, { departamento: "Financeiro", colaboradores: 30, custo: 200000, percentual: 20 }] } };
