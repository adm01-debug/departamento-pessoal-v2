import type { Meta, StoryObj } from "@storybook/react";
import { DocumentoList } from "./DocumentoList";
const meta: Meta<typeof DocumentoList> = { title: "Lists/DocumentoList", component: DocumentoList, tags: ["autodocs"] };
export default meta;
type Story = StoryObj<typeof DocumentoList>;
const mockDocs = [{ id: "1", tipo: "RG", numero: "00.000.000-0", dataEmissao: "01/01/2020", dataValidade: null }, { id: "2", tipo: "CNH", numero: "00000000000", dataEmissao: "15/06/2022", dataValidade: "15/06/2032" }, { id: "3", tipo: "ASO", numero: "12345", dataEmissao: "01/01/2024", dataValidade: "01/01/2025" }];
export const Default: Story = { args: { documentos: mockDocs } };
export const ComVencido: Story = { args: { documentos: [...mockDocs, { id: "4", tipo: "RESERVISTA", numero: "123", dataValidade: "01/01/2020" }] } };
