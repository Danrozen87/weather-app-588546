
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        success: 'bg-success-100 text-success-600 border border-success-200',
        warning: 'bg-warning-100 text-warning-600 border border-warning-200',
        error: 'bg-error-100 text-error-600 border border-error-200',
        info: 'bg-info-100 text-info-600 border border-info-200',
        neutral: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusVariants> {
  children: React.ReactNode;
}

const StatusIndicator = React.memo(React.forwardRef<HTMLSpanElement, StatusIndicatorProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(statusVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </span>
    );
  }
));

StatusIndicator.displayName = 'StatusIndicator';

export { StatusIndicator, statusVariants };
export type { StatusIndicatorProps };
