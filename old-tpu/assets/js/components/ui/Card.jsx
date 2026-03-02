import React from 'react';
import { cn } from '../lib/utils';

/**
 * Card - Container component based on shadcn/ui
 */

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('tpu-card', className)}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('tpu-card__header', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, as: Comp = 'h3', ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn('tpu-card__title', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('tpu-card__description', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('tpu-card__content', className)}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('tpu-card__footer', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };












