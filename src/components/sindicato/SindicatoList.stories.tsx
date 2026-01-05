import type { Meta, StoryObj } from "@storybook/react";
import { SindicatoList } from "./SindicatoList";
const meta: Meta<typeof SindicatoList> = { title: "Lists/SindicatoList", component: SindicatoList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof SindicatoList>;
const mockSindicatos = [{ id: "1", codigo: "SIND001", nome: "Sindicato dos Comerciários", cnpj: "12.345.678/0001-99", cidade: "São Paulo", uf: "SP", ativo: true }, { id: "2", codigo: "SIND002", nome: "Sindicato dos Metalúrgicos", cnpj: "98.765.432/0001-10", cidade: "São Paulo", uf: "SP", ativo: true }];
export const Default: Story = { args: { sindicatos: mockSindicatos } };
export const Empty: Story = { args: { sindicatos: [] } };
