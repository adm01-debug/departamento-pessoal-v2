import type { Meta, StoryObj } from "@storybook/react";
import { StatCard } from "./stat-card";
import { Users, DollarSign, Calendar } from "lucide-react";
const meta: Meta<typeof StatCard> = { title: "UI/StatCard", component: StatCard };
export default meta;
type Story = StoryObj<typeof StatCard>;
export const Default: Story = { args: { title: "Total Colaboradores", value: "150", icon: Users } };
export const WithTrend: Story = { args: { title: "Custo Folha", value: "R$ 1,5M", icon: DollarSign, trend: { value: 5, positive: false } } };
export const WithDescription: Story = { args: { title: "Férias Pendentes", value: "12", icon: Calendar, description: "Próximos 30 dias" } };
