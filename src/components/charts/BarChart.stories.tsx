import type { Meta, StoryObj } from "@storybook/react";
import { BarChart } from "./BarChart";
const meta: Meta<typeof BarChart> = { title: "Charts/BarChart", component: BarChart };
export default meta;
type Story = StoryObj<typeof BarChart>;
const data = [{ label: "TI", value: 45 }, { label: "RH", value: 30 }, { label: "Comercial", value: 55 }, { label: "Financeiro", value: 25 }];
export const Default: Story = { args: { data } };
export const WithColors: Story = { args: { data: data.map((d, i) => ({ ...d, color: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"][i] })) } };
