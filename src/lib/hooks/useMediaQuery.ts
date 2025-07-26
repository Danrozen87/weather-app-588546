
import { useState, useEffect } from 'react';
import { breakpointTokens, type BreakpointToken } from '@/design-system/tokens';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);
    
    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    media.addEventListener('change', listener);
    
    // Cleanup
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

// Enhanced breakpoint hooks using our design tokens
export const useBreakpoint = (breakpoint: BreakpointToken) => 
  useMediaQuery(`(min-width: ${breakpointTokens[breakpoint]})`);

export const useBreakpointDown = (breakpoint: BreakpointToken) => {
  const breakpointValue = parseInt(breakpointTokens[breakpoint]);
  return useMediaQuery(`(max-width: ${breakpointValue - 1}px)`);
};

export const useBreakpointBetween = (min: BreakpointToken, max: BreakpointToken) => {
  const minValue = breakpointTokens[min];
  const maxValue = parseInt(breakpointTokens[max]) - 1;
  return useMediaQuery(`(min-width: ${minValue}) and (max-width: ${maxValue}px)`);
};

// Comprehensive device detection hooks
export const useIsXS = () => useBreakpoint('xs');
export const useIsSM = () => useBreakpoint('sm');
export const useIsMD = () => useBreakpoint('md');
export const useIsLG = () => useBreakpoint('lg');
export const useIsXL = () => useBreakpoint('xl');
export const useIs2XL = () => useBreakpoint('2xl');
export const useIs3XL = () => useBreakpoint('3xl');
export const useIs4XL = () => useBreakpoint('4xl');
export const useIs5XL = () => useBreakpoint('5xl');
export const useIs6XL = () => useBreakpoint('6xl');
export const useIs7XL = () => useBreakpoint('7xl');
export const useIs8XL = () => useBreakpoint('8xl');

// Semantic device hooks
export const useIsMobile = () => useBreakpointDown('md');
export const useIsTablet = () => useBreakpointBetween('md', 'lg');
export const useIsDesktop = () => useBreakpoint('lg');
export const useIsWidescreen = () => useBreakpoint('3xl');
export const useIsUltraWide = () => useBreakpoint('6xl');

// Current breakpoint detection
export const useCurrentBreakpoint = (): BreakpointToken => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointToken>('lg');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      const breakpoints = Object.entries(breakpointTokens) as [BreakpointToken, string][];
      
      // Find the largest breakpoint that the current width exceeds
      for (let i = breakpoints.length - 1; i >= 0; i--) {
        const [breakpoint, value] = breakpoints[i];
        if (width >= parseInt(value)) {
          setCurrentBreakpoint(breakpoint);
          return;
        }
      }
      
      setCurrentBreakpoint('xs');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return currentBreakpoint;
};
