import React from 'react';
import { cn } from '../lib/utils';

/**
 * Badge - Small label component based on shadcn/ui
 */

const badgeVariants = {
  default: 'tpu-badge--default',
  secondary: 'tpu-badge--secondary',
  destructive: 'tpu-badge--destructive',
  outline: 'tpu-badge--outline',
  success: 'tpu-badge--success',
  warning: 'tpu-badge--warning',
};

const Badge = React.forwardRef(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn('tpu-badge', badgeVariants[variant], className)}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };












