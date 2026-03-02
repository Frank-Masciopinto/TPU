import React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '../lib/utils';

/**
 * Progress - Progress bar component based on shadcn/ui
 * Built on Radix UI Progress primitives
 */

const Progress = React.forwardRef(({ className, value, max = 100, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('tpu-progress', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="tpu-progress__indicator"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };











