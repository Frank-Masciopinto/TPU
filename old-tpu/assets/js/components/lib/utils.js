import clsx from 'clsx';

/**
 * Utility function for merging class names
 * Similar to shadcn's cn utility but without tailwind-merge
 */
export function cn(...inputs) {
  return clsx(inputs);
}

