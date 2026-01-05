import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "./user-avatar";
const meta: Meta<typeof UserAvatar> = { title: "UI/UserAvatar", component: UserAvatar };
export default meta;
type Story = StoryObj<typeof UserAvatar>;
export const Small: Story = { args: { name: "João Silva", size: "sm" } };
export const Medium: Story = { args: { name: "João Silva", size: "md" } };
export const Large: Story = { args: { name: "João Silva", size: "lg" } };
export const WithName: Story = { args: { name: "João Silva", size: "md", showName: true, subtitle: "Desenvolvedor" } };
