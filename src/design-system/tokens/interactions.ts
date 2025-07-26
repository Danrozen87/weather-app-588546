
/**
 * @file interactions.ts
 * @purpose Comprehensive interaction design tokens for hover, focus, and accessibility
 * @dependencies colors.ts, animations.ts
 * @ai-context Central system for all interactive states and accessibility features
 */

import { colorTokens } from './colors';
import { animationTokens } from './animations';

// Interaction timing tokens
export const interactionTokens = {
  // Timing for different interaction types
  timing: {
    instant: '0ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    // Semantic timing
    hover: '200ms',
    focus: '150ms',
    active: '100ms',
    disabled: '200ms',
  },

  // Easing curves for interactions
  easing: {
    hover: 'cubic-bezier(0.4, 0, 0.2, 1)',
    focus: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    active: 'cubic-bezier(0.4, 0, 0.6, 1)',
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },

  // Transform values for interactions
  transform: {
    hover: {
      subtle: 'translateY(-1px) scale(1.01)',
      medium: 'translateY(-2px) scale(1.02)',
      strong: 'translateY(-4px) scale(1.05)',
    },
    focus: {
      subtle: 'scale(1.01)',
      medium: 'scale(1.02)',
      strong: 'scale(1.05)',
    },
    active: {
      subtle: 'scale(0.99)',
      medium: 'scale(0.98)',
      strong: 'scale(0.95)',
    },
  },

  // Shadow tokens for elevation changes
  shadow: {
    hover: {
      subtle: '0 2px 8px rgba(0, 0, 0, 0.08)',
      medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
      strong: '0 8px 32px rgba(0, 0, 0, 0.16)',
    },
    focus: {
      ring: '0 0 0 2px hsl(var(--ring))',
      visible: '0 0 0 2px hsl(var(--ring)), 0 0 0 4px hsl(var(--ring) / 0.2)',
    },
  },

  // Hover state color variations
  hover: {
    primary: {
      background: 'hsl(var(--primary) / 0.9)',
      border: 'hsl(var(--primary) / 0.8)',
      text: 'hsl(var(--primary-foreground))',
    },
    secondary: {
      background: 'hsl(var(--secondary) / 0.8)',
      border: 'hsl(var(--secondary) / 0.7)',
      text: 'hsl(var(--secondary-foreground))',
    },
    destructive: {
      background: 'hsl(var(--destructive) / 0.9)',
      border: 'hsl(var(--destructive) / 0.8)',
      text: 'hsl(var(--destructive-foreground))',
    },
    muted: {
      background: 'hsl(var(--muted) / 0.8)',
      border: 'hsl(var(--muted) / 0.7)',
      text: 'hsl(var(--muted-foreground))',
    },
    accent: {
      background: 'hsl(var(--accent) / 0.8)',
      border: 'hsl(var(--accent) / 0.7)',
      text: 'hsl(var(--accent-foreground))',
    },
    // Semantic colors
    success: {
      background: 'hsl(var(--success-600))',
      border: 'hsl(var(--success-700))',
      text: 'hsl(var(--success-50))',
    },
    warning: {
      background: 'hsl(var(--warning-600))',
      border: 'hsl(var(--warning-700))',
      text: 'hsl(var(--warning-50))',
    },
    error: {
      background: 'hsl(var(--error-600))',
      border: 'hsl(var(--error-700))',
      text: 'hsl(var(--error-50))',
    },
    info: {
      background: 'hsl(var(--info-600))',
      border: 'hsl(var(--info-700))',
      text: 'hsl(var(--info-50))',
    },
  },

  // Focus state variations
  focus: {
    ring: 'hsl(var(--ring))',
    visible: 'hsl(var(--ring) / 0.5)',
    offset: '2px',
    width: '2px',
  },

  // Active state variations
  active: {
    primary: {
      background: 'hsl(var(--primary) / 0.95)',
      border: 'hsl(var(--primary))',
      text: 'hsl(var(--primary-foreground))',
    },
    secondary: {
      background: 'hsl(var(--secondary) / 0.95)',
      border: 'hsl(var(--secondary))',
      text: 'hsl(var(--secondary-foreground))',
    },
  },

  // Disabled state variations
  disabled: {
    background: 'hsl(var(--muted) / 0.5)',
    border: 'hsl(var(--muted) / 0.3)',
    text: 'hsl(var(--muted-foreground) / 0.5)',
    cursor: 'not-allowed',
  },
} as const;

// Accessibility tokens
export const accessibilityTokens = {
  // Focus management
  focus: {
    ring: {
      width: '2px',
      offset: '2px',
      color: 'hsl(var(--ring))',
      style: 'solid',
    },
    visible: {
      width: '2px',
      offset: '2px',
      color: 'hsl(var(--ring) / 0.8)',
      style: 'dashed',
    },
    trap: {
      zIndex: 9999,
      outline: 'none',
    },
  },

  // Color contrast requirements
  contrast: {
    aa: {
      normal: 4.5,
      large: 3.0,
    },
    aaa: {
      normal: 7.0,
      large: 4.5,
    },
  },

  // Touch target sizes
  touch: {
    minimum: '44px',
    comfortable: '48px',
    recommended: '56px',
  },

  // Screen reader utilities
  screenReader: {
    only: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0',
    },
    focusable: {
      position: 'absolute',
      width: 'auto',
      height: 'auto',
      padding: 'inherit',
      margin: 'inherit',
      overflow: 'visible',
      clip: 'auto',
      whiteSpace: 'normal',
    },
  },

  // Reduced motion preferences
  motion: {
    reduced: {
      animation: 'none',
      transition: 'none',
      transform: 'none',
    },
    respectPreference: true,
  },

  // High contrast mode
  highContrast: {
    border: '1px solid',
    background: 'Canvas',
    color: 'CanvasText',
    forced: '@media (forced-colors: active)',
  },
} as const;

// Interaction utilities
export const interactionUtils = {
  // Create hover styles
  createHoverStyle: (variant: keyof typeof interactionTokens.hover, intensity: 'subtle' | 'medium' | 'strong' = 'medium') => ({
    transition: `all ${interactionTokens.timing.hover} ${interactionTokens.easing.hover}`,
    '&:hover': {
      backgroundColor: interactionTokens.hover[variant].background,
      borderColor: interactionTokens.hover[variant].border,
      color: interactionTokens.hover[variant].text,
      transform: interactionTokens.transform.hover[intensity],
      boxShadow: interactionTokens.shadow.hover[intensity],
    },
    '&:active': {
      transform: interactionTokens.transform.active[intensity],
    },
  }),

  // Create focus styles
  createFocusStyle: (visible: boolean = false) => ({
    '&:focus': {
      outline: 'none',
      boxShadow: visible ? interactionTokens.shadow.focus.visible : interactionTokens.shadow.focus.ring,
    },
    '&:focus-visible': {
      outline: 'none',
      boxShadow: interactionTokens.shadow.focus.visible,
    },
  }),

  // Create disabled styles
  createDisabledStyle: () => ({
    '&:disabled, &[aria-disabled="true"]': {
      backgroundColor: interactionTokens.disabled.background,
      borderColor: interactionTokens.disabled.border,
      color: interactionTokens.disabled.text,
      cursor: interactionTokens.disabled.cursor,
      transform: 'none',
      boxShadow: 'none',
      pointerEvents: 'none',
    },
  }),

  // Create accessible interaction styles
  createAccessibleInteraction: (variant: keyof typeof interactionTokens.hover, intensity: 'subtle' | 'medium' | 'strong' = 'medium') => ({
    ...interactionUtils.createHoverStyle(variant, intensity),
    ...interactionUtils.createFocusStyle(true),
    ...interactionUtils.createDisabledStyle(),
    // Respect reduced motion
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      transform: 'none',
      '&:hover': {
        transform: 'none',
      },
      '&:active': {
        transform: 'none',
      },
    },
  }),
};

export type InteractionToken = typeof interactionTokens;
export type AccessibilityToken = typeof accessibilityTokens;
