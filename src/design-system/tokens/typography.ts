
export const typographyTokens = {
  // Three-font system with semantic purpose mapping
  fontFamily: {
    // Rare headers - Playfair Display (elegant, sophisticated)
    rare: ['Playfair Display', 'Georgia', 'serif'],
    // UI headers - Manrope (modern, clean, everyday UX)
    ui: ['Manrope', 'system-ui', 'sans-serif'],
    // Body text - Inter (readable, neutral, optimized for screens)
    body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    // Monospace - for code and technical content
    mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
  },

  // Font-specific weight scales
  fontWeight: {
    // Playfair Display weights
    rare: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    // Manrope weights
    ui: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    // Inter weights
    body: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    // JetBrains Mono weights
    mono: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Responsive font size scales
  fontSize: {
    // Rare header sizes (Playfair Display)
    rare: {
      sm: ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
      md: ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
      lg: ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.03em' }],
      xl: ['4rem', { lineHeight: '4.25rem', letterSpacing: '-0.03em' }],
      '2xl': ['5rem', { lineHeight: '5.25rem', letterSpacing: '-0.04em' }],
      '3xl': ['6rem', { lineHeight: '6.25rem', letterSpacing: '-0.04em' }],
    },
    // UI header sizes (Manrope)
    ui: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0em' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.015em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em' }],
    },
    // Body text sizes (Inter)
    body: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
    },
    // Monospace sizes (JetBrains Mono)
    mono: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
    },
  },

  // Letter spacing optimized for each font family
  letterSpacing: {
    rare: {
      tight: '-0.04em',
      normal: '-0.02em',
      wide: '0em',
    },
    ui: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
    },
    body: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
    },
    mono: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
    },
  },

  // Semantic typography mapping
  semantic: {
    // Rare headers - for hero sections, landing pages, special occasions
    heroTitle: { family: 'rare', size: '3xl', weight: 'bold' },
    heroSubtitle: { family: 'rare', size: 'lg', weight: 'medium' },
    sectionTitle: { family: 'rare', size: 'xl', weight: 'semibold' },
    
    // UI headers - for everyday interface elements
    pageTitle: { family: 'ui', size: '4xl', weight: 'bold' },
    cardTitle: { family: 'ui', size: '2xl', weight: 'semibold' },
    sectionHeader: { family: 'ui', size: 'xl', weight: 'semibold' },
    subsectionHeader: { family: 'ui', size: 'lg', weight: 'medium' },
    label: { family: 'ui', size: 'sm', weight: 'medium' },
    caption: { family: 'ui', size: 'xs', weight: 'normal' },
    
    // Body text - for content and reading
    bodyLarge: { family: 'body', size: 'lg', weight: 'normal' },
    body: { family: 'body', size: 'base', weight: 'normal' },
    bodySmall: { family: 'body', size: 'sm', weight: 'normal' },
    
    // Code and technical content
    code: { family: 'mono', size: 'sm', weight: 'normal' },
    codeBlock: { family: 'mono', size: 'base', weight: 'normal' },
  },
} as const;

export type TypographyToken = typeof typographyTokens;
export type FontFamily = keyof typeof typographyTokens.fontFamily;
export type SemanticTypography = keyof typeof typographyTokens.semantic;
