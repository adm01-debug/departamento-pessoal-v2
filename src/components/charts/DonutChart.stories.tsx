import type { Meta, StoryObj } from "@storybook/react";
import { DonutChart } from "./DonutChart";
const meta: Meta<typeof DonutChart> = { title: "Charts/DonutChart", component: DonutChart };
export default meta;
type Story = StoryObj<typeof DonutChart>;
const data = [{ label: "CLT", value: 100, color: "#22c55e" }, { label: "PJ", value: 30, color: "#3b82f6" }, { label: "Estagiário", value: 20, color: "#f59e0b" }];
export const Default: Story = { args: { data } };
export const WithCenter: Story = { args: { data, centerValue: "150", centerLabel: "Total" } };
