import type { Meta, StoryObj } from "@storybook/react";
import { HoleritePrint } from "./HoleritePrint";
const meta: Meta<typeof HoleritePrint> = { title: "Print/HoleritePrint", component: HoleritePrint };
export default meta;
type Story = StoryObj<typeof HoleritePrint>;
const mockData = { empresa: { nome: "Empresa Exemplo LTDA", cnpj: "00.000.000/0001-00" }, colaborador: { nome: "João Silva", cpf: "123.456.789-00", cargo: "Desenvolvedor", departamento: "TI", admissao: "01/03/2023" }, competencia: "01/2025", proventos: [{ rubrica: "Salário Base", valor: 5000 }, { rubrica: "Hora Extra 50%", ref: 10, valor: 340.91 }], descontos: [{ rubrica: "INSS", valor: 400 }, { rubrica: "IRRF", valor: 150 }], totais: { bruto: 5340.91, descontos: 550, liquido: 4790.91, baseINSS: 5340.91, baseIRRF: 4940.91, baseFGTS: 5340.91, fgts: 427.27 } };
export const Default: Story = { args: { data: mockData } };
