import React from 'react';
import { cn } from '../lib/utils';

/**
 * Alert - Notification banner component based on shadcn/ui
 */

const alertVariants = {
  default: 'tpu-alert--default',
  destructive: 'tpu-alert--destructive',
  warning: 'tpu-alert--warning',
  success: 'tpu-alert--success',
};

const Alert = React.forwardRef(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn('tpu-alert', alertVariants[variant], className)}
    {...props}
  />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('tpu-alert__title', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('tpu-alert__description', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };












