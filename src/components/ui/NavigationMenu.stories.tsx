import type { Meta, StoryObj } from "@storybook/react";
import { NavigationMenu } from "./NavigationMenu";

const meta: Meta<typeof NavigationMenu> = {
  title: "Components/NavigationMenu",
  component: NavigationMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: "NavigationMenu" } };
export const WithVariants: Story = { args: { children: "NavigationMenu Variant", variant: "primary" } };
export const Small: Story = { args: { children: "NavigationMenu", size: "sm" } };
export const Large: Story = { args: { children: "NavigationMenu", size: "lg" } };
