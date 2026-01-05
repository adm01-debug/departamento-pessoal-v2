import type { Meta, StoryObj } from "@storybook/react";
import { ProgressRing } from "./ProgressRing";
const meta: Meta<typeof ProgressRing> = { title: "Charts/ProgressRing", component: ProgressRing };
export default meta;
type Story = StoryObj<typeof ProgressRing>;
export const Default: Story = { args: { value: 75 } };
export const WithLabel: Story = { args: { value: 85, label: "Completo" } };
export const CustomColor: Story = { args: { value: 60, color: "#22c55e" } };
