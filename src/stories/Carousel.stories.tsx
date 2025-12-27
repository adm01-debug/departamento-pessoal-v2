import type { Meta, StoryObj } from '@storybook/react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
const meta: Meta<typeof Carousel> = { title: 'UI/Carousel', component: Carousel };
export default meta;
type Story = StoryObj<typeof Carousel>;
export const Default: Story = { render: () => <Carousel><CarouselContent><CarouselItem>Slide 1</CarouselItem><CarouselItem>Slide 2</CarouselItem></CarouselContent><CarouselPrevious /><CarouselNext /></Carousel> };
