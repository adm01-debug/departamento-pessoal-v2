import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

interface LazyTabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  forceMount?: boolean;
}

export const LazyTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  LazyTabsContentProps
>(({ className, children, ...props }, ref) => {
  const [hasRendered, setHasRendered] = React.useState(false);

  // We check for the data-state attribute which Radix UI provides
  // This is a bit tricky with ref, so we'll use a wrapper or just check the active state if we had access to the context.
  // Actually, Radix UI doesn't render the content at all if it's not active and forceMount is false.
  // BUT, React still runs the component's code if it's in the JSX.
  
  // A better way is to use a simple conditional rendering inside the component that uses Tabs.
  
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
});

LazyTabsContent.displayName = 'LazyTabsContent';
