import React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { cn } from '../lib/utils';

/**
 * ToggleGroup - Segmented control component based on shadcn/ui
 * Built on Radix UI ToggleGroup primitives
 */

const ToggleGroupContext = React.createContext({
  size: 'default',
  variant: 'default',
});

const ToggleGroup = React.forwardRef(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn('tpu-toggle-group', className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
);
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        'tpu-toggle-group__item',
        `tpu-toggle-group__item--${variant || context.variant}`,
        `tpu-toggle-group__item--${size || context.size}`,
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
});
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };












