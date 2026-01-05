import type { Meta, StoryObj } from "@storybook/react";
import { Sparkline } from "./Sparkline";
const meta: Meta<typeof Sparkline> = { title: "Charts/Sparkline", component: Sparkline };
export default meta;
type Story = StoryObj<typeof Sparkline>;
export const Default: Story = { args: { data: [10, 25, 18, 30, 22, 35, 28, 40] } };
export const Trend: Story = { args: { data: [5, 8, 12, 15, 20, 25, 30, 35], color: "#22c55e" } };
