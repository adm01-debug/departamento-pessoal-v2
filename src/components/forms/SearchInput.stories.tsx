import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./SearchInput";
const meta: Meta<typeof SearchInput> = { title: "Forms/SearchInput", component: SearchInput };
export default meta;
type Story = StoryObj<typeof SearchInput>;
export const Default: Story = { args: { placeholder: "Buscar..." } };
export const WithValue: Story = { args: { value: "João Silva" } };
