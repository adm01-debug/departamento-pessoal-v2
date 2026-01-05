import type { Meta, StoryObj } from "@storybook/react";
import { GaugeChart } from "./GaugeChart";
const meta: Meta<typeof GaugeChart> = { title: "Charts/GaugeChart", component: GaugeChart };
export default meta;
type Story = StoryObj<typeof GaugeChart>;
export const Low: Story = { args: { value: 25, label: "Risco" } };
export const Medium: Story = { args: { value: 50, label: "Progresso" } };
export const High: Story = { args: { value: 85, label: "Performance" } };
