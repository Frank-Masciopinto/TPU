import React from 'react';
import { cn } from '../lib/utils';

/**
 * Input - Base input component based on shadcn/ui
 * Styled for dark mode compatibility with TPU theme
 */

const Input = React.forwardRef(
  ({ className, type = 'text', hasError = false, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'tpu-input',
          hasError && 'tpu-input--error',
          className
        )}
        ref={ref}
        aria-invalid={hasError ? 'true' : undefined}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
