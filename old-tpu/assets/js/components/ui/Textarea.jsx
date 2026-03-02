import React from 'react';
import { cn } from '../lib/utils';

/**
 * Textarea - Multiline input component based on shadcn/ui
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn('tpu-textarea', className)}
    {...props}
  />
));
Textarea.displayName = 'Textarea';

export { Textarea };

