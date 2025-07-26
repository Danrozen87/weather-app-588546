
import { animationTokens } from './animations';

// Memoized animation utility functions for better performance
const animationCache = new Map<string, React.CSSProperties>();

export const animationUtils = {
  // Create staggered animation with delay (memoized)
  createStaggeredAnimation: (
    index: number,
    baseDelay: number = 100,
    animation: string = 'gentle-fade-up'
  ): React.CSSProperties => {
    const cacheKey = `staggered-${index}-${baseDelay}-${animation}`;
    
    if (animationCache.has(cacheKey)) {
      return animationCache.get(cacheKey)!;
    }

    const styles: React.CSSProperties = {
      animation: `${animation} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
      animationDelay: `${index * baseDelay}ms`,
      willChange: 'transform, opacity',
    };

    animationCache.set(cacheKey, styles);
    return styles;
  },

  // Create parallax animation with depth (memoized)
  createParallaxAnimation: (
    depth: number = 1,
    direction: 'up' | 'down' = 'up'
  ): React.CSSProperties => {
    const cacheKey = `parallax-${depth}-${direction}`;
    
    if (animationCache.has(cacheKey)) {
      return animationCache.get(cacheKey)!;
    }

    const styles: React.CSSProperties = {
      transform: `translateZ(${depth * 10}px)`,
      animation: `parallax-float ${2 + depth}s ease-in-out infinite ${direction === 'down' ? 'reverse' : ''}`,
      willChange: 'transform',
    };

    animationCache.set(cacheKey, styles);
    return styles;
  },

  // Create morphing animation for containers (memoized)
  createMorphAnimation: (
    duration: string = '0.8s',
    easing: string = 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  ): React.CSSProperties => {
    const cacheKey = `morph-${duration}-${easing}`;
    
    if (animationCache.has(cacheKey)) {
      return animationCache.get(cacheKey)!;
    }

    const styles: React.CSSProperties = {
      animation: `morphing-container ${duration} ${easing} both`,
      willChange: 'border-radius, transform',
    };

    animationCache.set(cacheKey, styles);
    return styles;
  },

  // Create reveal animation with custom timing (memoized)
  createRevealAnimation: (
    type: 'gentle' | 'elegant' | 'organic' | 'purposeful' | 'ceremonial' = 'gentle',
    duration?: string
  ): React.CSSProperties => {
    const cacheKey = `reveal-${type}-${duration || 'default'}`;
    
    if (animationCache.has(cacheKey)) {
      return animationCache.get(cacheKey)!;
    }

    const animations = {
      gentle: `gentle-fade-up ${duration || '0.6s'} cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
      elegant: `elegant-scale-fade ${duration || '0.5s'} cubic-bezier(0.23, 1, 0.32, 1) both`,
      organic: `organic-slide-reveal ${duration || '0.7s'} cubic-bezier(0.645, 0.045, 0.355, 1) both`,
      purposeful: `purposeful-unveil ${duration || '0.8s'} cubic-bezier(0.19, 1, 0.22, 1) both`,
      ceremonial: `ceremonial-entrance ${duration || '1.5s'} cubic-bezier(0.19, 1, 0.22, 1) both`,
    };

    const styles: React.CSSProperties = {
      animation: animations[type],
      willChange: 'transform, opacity',
    };

    animationCache.set(cacheKey, styles);
    return styles;
  },

  // Get animation preset (memoized)
  getPreset: (presetName: keyof typeof animationTokens.presets): React.CSSProperties => {
    const cacheKey = `preset-${presetName}`;
    
    if (animationCache.has(cacheKey)) {
      return animationCache.get(cacheKey)!;
    }

    const styles = animationTokens.presets[presetName];
    animationCache.set(cacheKey, styles);
    return styles;
  },

  // Create responsive animation (respects reduced motion)
  createAccessibleAnimation: (
    animation: React.CSSProperties,
    fallback: React.CSSProperties = {}
  ): React.CSSProperties => {
    if (animationUtils.prefersReducedMotion()) {
      return {
        animation: 'none',
        transition: 'none',
        transform: 'none',
        ...fallback,
      };
    }
    return animation;
  },

  // Create entrance animation sequence (optimized)
  createEntranceSequence: (
    elements: number,
    baseDelay: number = 150,
    animationType: 'gentle' | 'elegant' | 'organic' = 'gentle'
  ): React.CSSProperties[] => {
    return Array.from({ length: elements }, (_, index) => 
      animationUtils.createStaggeredAnimation(index, baseDelay, `${animationType}-fade-up`)
    );
  },

  // Create interaction feedback animation (optimized)
  createInteractionFeedback: (
    type: 'hover' | 'focus' | 'active' | 'disabled' = 'hover',
    intensity: 'subtle' | 'medium' | 'strong' = 'medium'
  ): React.CSSProperties => {
    const cacheKey = `interaction-${type}-${intensity}`;
    
    if (animationCache.has(cacheKey)) {
      return animationCache.get(cacheKey)!;
    }

    const intensityMap = {
      subtle: { scale: 1.02, translateY: '-1px' },
      medium: { scale: 1.05, translateY: '-2px' },
      strong: { scale: 1.08, translateY: '-4px' },
    };

    const config = intensityMap[intensity];
    
    const styles: React.CSSProperties = {
      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      willChange: 'transform',
    };

    animationCache.set(cacheKey, styles);
    return styles;
  },

  // Performance optimization helpers
  enableGPUAcceleration: (element: HTMLElement): void => {
    element.style.willChange = 'transform';
    element.style.transform = 'translateZ(0)';
  },

  disableGPUAcceleration: (element: HTMLElement): void => {
    element.style.willChange = 'auto';
    element.style.transform = '';
  },

  // Check if reduced motion is preferred (cached)
  prefersReducedMotion: (() => {
    let cachedValue: boolean | null = null;
    
    return (): boolean => {
      if (cachedValue === null) {
        cachedValue = typeof window !== 'undefined' && 
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
      return cachedValue;
    };
  })(),

  // Clear animation cache for memory management
  clearCache: (): void => {
    animationCache.clear();
  },
};

// Performance utilities for animations
export const animationPerformanceUtils = {
  // Optimize animation performance
  optimizeAnimation: (element: HTMLElement, animation: string): void => {
    element.style.willChange = 'transform, opacity';
    element.style.animation = animation;
    
    // Clean up after animation
    const cleanup = () => {
      element.style.willChange = 'auto';
    };
    
    element.addEventListener('animationend', cleanup, { once: true });
    element.addEventListener('animationcancel', cleanup, { once: true });
  },

  // Batch DOM updates for staggered animations
  batchStaggeredAnimations: (
    elements: NodeListOf<HTMLElement>,
    baseDelay: number = 100
  ): void => {
    requestAnimationFrame(() => {
      elements.forEach((element, index) => {
        element.style.animationDelay = `${index * baseDelay}ms`;
        element.classList.add('animate-staggered-reveal');
      });
    });
  },

  // Preload animation styles
  preloadAnimationStyles: (): void => {
    if (typeof document === 'undefined') return;
    
    const style = document.createElement('style');
    style.textContent = `
      .will-change-transform { will-change: transform; }
      .will-change-opacity { will-change: opacity; }
      .will-change-auto { will-change: auto; }
      .gpu-accelerated { transform: translateZ(0); }
    `;
    document.head.appendChild(style);
  },
};

// Export all animation utilities
export const animationSystemUtils = {
  ...animationUtils,
  performance: animationPerformanceUtils,
  tokens: animationTokens,
};
