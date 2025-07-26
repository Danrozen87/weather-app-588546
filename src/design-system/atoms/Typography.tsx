
/**
 * @file Typography.tsx
 * @purpose Foundational typography component with semantic variants and responsive behavior
 * @dependencies React, class-variance-authority, design tokens
 * @ai-context Core text rendering component - handles all typography needs
 * @performance Memoized with optimized className computation
 * @accessibility WCAG 2.1 AA compliant with proper semantic HTML
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const typographyVariants = cva('', {
  variants: {
    variant: {
      // Rare headers - Playfair Display for special occasions
      heroTitle: 'font-rare text-5xl font-bold tracking-tight lg:text-6xl',
      heroSubtitle: 'font-rare text-xl font-medium tracking-tight lg:text-2xl',
      sectionTitle: 'font-rare text-3xl font-semibold tracking-tight lg:text-4xl',
      
      // UI headers - Manrope for everyday interface
      pageTitle: 'font-ui text-4xl font-bold tracking-tight lg:text-5xl',
      cardTitle: 'font-ui text-xl font-semibold tracking-tight lg:text-2xl',
      sectionHeader: 'font-ui text-2xl font-semibold tracking-tight lg:text-3xl',
      subsectionHeader: 'font-ui text-lg font-medium tracking-tight lg:text-xl',
      label: 'font-ui text-sm font-medium tracking-wide uppercase',
      caption: 'font-ui text-xs font-normal tracking-wide',
      
      // Body text - Inter for reading
      bodyLarge: 'font-body text-lg leading-relaxed',
      body: 'font-body text-base leading-relaxed',
      bodySmall: 'font-body text-sm leading-relaxed',
      
      // Utility variants
      lead: 'font-body text-xl text-muted-foreground leading-relaxed',
      large: 'font-ui text-lg font-semibold',
      small: 'font-ui text-sm font-medium leading-none',
      muted: 'font-body text-sm text-muted-foreground',
      code: 'font-mono relative rounded bg-muted px-[0.3rem] py-[0.2rem] text-sm font-semibold',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-destructive',
      success: 'text-success-600',
      warning: 'text-warning-600',
      error: 'text-error-600',
      info: 'text-info-600',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    responsive: {
      true: 'text-balance',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'body',
    color: 'default',
    align: 'left',
    responsive: false,
  },
});

interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: React.ElementType;
  children: React.ReactNode;
  fluid?: boolean;
}

/**
 * Maps typography variants to appropriate HTML elements for semantic correctness
 * @param variant - The typography variant
 * @returns Appropriate HTML element type
 * @ai-context Ensures semantic HTML structure for accessibility
 */
const getDefaultElement = (variant: string | null | undefined): React.ElementType => {
  switch (variant) {
    case 'heroTitle':
    case 'pageTitle':
      return 'h1';
    case 'sectionTitle':
    case 'sectionHeader':
      return 'h2';
    case 'cardTitle':
    case 'subsectionHeader':
      return 'h3';
    case 'heroSubtitle':
    case 'lead':
    case 'bodyLarge':
    case 'body':
    case 'bodySmall':
      return 'p';
    case 'label':
      return 'span';
    case 'caption':
    case 'small':
    case 'muted':
      return 'small';
    case 'code':
      return 'code';
    default:
      return 'p';
  }
};

/**
 * Typography component for consistent text rendering across the application
 * @param variant - Typography style variant (heroTitle, body, etc.)
 * @param color - Text color variant
 * @param align - Text alignment
 * @param responsive - Enable responsive text behavior
 * @param as - Override default HTML element
 * @param fluid - Enable fluid typography (text-pretty)
 * @returns Styled typography element
 * 
 * @example
 * <Typography variant="heroTitle" color="primary">
 *   Welcome to our platform
 * </Typography>
 * 
 * @ai-context Primary text component - use for all text rendering needs
 * @performance Memoized with optimized className computation
 */
const Typography = React.memo(React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, color, align, responsive, as, children, fluid, ...props }, ref) => {
    const Component = as || getDefaultElement(variant);
    
    // Memoize className computation for performance
    const memoizedClassName = React.useMemo(() => cn(
      typographyVariants({ variant, color, align, responsive }),
      fluid && 'text-pretty',
      className
    ), [variant, color, align, responsive, fluid, className]);
    
    return (
      <Component
        className={memoizedClassName}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
));

Typography.displayName = 'Typography';

export { Typography, typographyVariants };
export type { TypographyProps };
