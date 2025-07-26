
// Optimized token system with performance-focused exports
// Tree-shaking optimized and centralized token access

// === CORE TOKENS ===
export {
  colorTokens,
  colorCategories,
  type ColorToken,
  type ColorCategory,
  type ColorScale,
  type SemanticColor,
  type BrandColor,
  type AccentColor,
} from './colors';

export {
  spacingTokens,
  type SpacingToken,
  getSpacing,
} from './spacing';

export {
  typographyTokens,
  type TypographyToken,
  type FontFamily,
  type SemanticTypography,
} from './typography';

export {
  animationTokens,
  type AnimationToken,
} from './animations';

export {
  elevationTokens,
} from './elevation';

export {
  breakpointTokens,
  breakpointCategories,
  containerSizes,
  fluidSpacing,
  type BreakpointToken,
} from './breakpoints';


// === OPTIMIZED COMBINED TOKENS ===
import { colorTokens, colorCategories } from './colors';
import { spacingTokens, getSpacing } from './spacing';
import { typographyTokens } from './typography';
import { animationTokens } from './animations';
import { elevationTokens } from './elevation';
import { breakpointTokens, breakpointCategories, containerSizes, fluidSpacing } from './breakpoints';

export const designTokens = {
  colors: colorTokens,
  spacing: spacingTokens,
  typography: typographyTokens,
  animations: animationTokens,
  elevation: elevationTokens,
  breakpoints: breakpointTokens,
  breakpointCategories,
  containerSizes,
  fluidSpacing,
} as const;

// === UTILITIES - LAZY LOADED ===
export {
  colorUtils,
  themeUtils,
  performanceUtils,
  cssUtils,
} from './utilities';

export {
  fontUtils,
  semanticUtils,
  validationUtils,
  performanceUtils as typographyPerformanceUtils,
} from './typographyUtils';

export {
  animationUtils,
  animationPerformanceUtils,
  animationSystemUtils,
} from './animationUtils';

export * from './breakpointUtils';

// === PERFORMANCE OPTIMIZATIONS ===
export const createTokenAccessor = <T extends keyof typeof designTokens>(
  category: T
) => {
  const tokens = designTokens[category];
  return (path: string) => {
    return path.split('.').reduce((obj: any, key) => obj?.[key], tokens);
  };
};

// === LEGACY SUPPORT ===
export const tokens = designTokens;
