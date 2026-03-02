import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '../lib/utils';

/**
 * Tabs - Tab navigation component based on shadcn/ui
 * Built on Radix UI Tabs primitives
 */

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('tpu-tabs__list', className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn('tpu-tabs__trigger', className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('tpu-tabs__content', className)}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };











