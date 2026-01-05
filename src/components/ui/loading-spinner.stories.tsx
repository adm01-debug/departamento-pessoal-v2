import type { Meta, StoryObj } from "@storybook/react";
import { LoadingSpinner, LoadingPage } from "./loading-spinner";
const meta: Meta<typeof LoadingSpinner> = { title: "UI/LoadingSpinner", component: LoadingSpinner };
export default meta;
type Story = StoryObj<typeof LoadingSpinner>;
export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg", text: "Carregando..." } };
