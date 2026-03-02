import React from 'react';
import { cn } from '../lib/utils';

/**
 * Button - Base button component based on shadcn/ui
 */

const buttonVariants = {
  default: 'tpu-button--default',
  destructive: 'tpu-button--destructive',
  outline: 'tpu-button--outline',
  secondary: 'tpu-button--secondary',
  ghost: 'tpu-button--ghost',
  link: 'tpu-button--link',
};

const buttonSizes = {
  default: 'tpu-button--md',
  sm: 'tpu-button--sm',
  lg: 'tpu-button--lg',
  icon: 'tpu-button--icon',
};

const Button = React.forwardRef(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? 'span' : 'button';
    
    return (
      <Comp
        className={cn(
          'tpu-button',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants, buttonSizes };












