
/**
 * @file useAccessibility.ts
 * @purpose Comprehensive accessibility utilities and hooks
 * @dependencies React, design system tokens
 * @ai-context Central hook for accessibility features and ARIA management
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { accessibilityTokens } from '@/design-system/tokens/interactions';

// Focus management hook
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    element.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTab);
    };
  }, []);

  return {
    focusedElement,
    saveFocus,
    restoreFocus,
    trapFocus,
    setFocusedElement,
  };
}

// Screen reader announcements
export function useScreenReaderAnnouncements() {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const clearAnnouncements = useCallback(() => {
    setAnnouncements([]);
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = '';
    }
  }, []);

  return {
    announce,
    clearAnnouncements,
    announcements,
    liveRegionRef,
  };
}

// Keyboard navigation
export function useKeyboardNavigation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsRef = useRef<HTMLElement[]>([]);

  const registerItem = useCallback((element: HTMLElement) => {
    if (!itemsRef.current.includes(element)) {
      itemsRef.current.push(element);
    }
  }, []);

  const unregisterItem = useCallback((element: HTMLElement) => {
    itemsRef.current = itemsRef.current.filter(item => item !== element);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const items = itemsRef.current;
    if (items.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        setCurrentIndex(prev => (prev + 1) % items.length);
        items[(currentIndex + 1) % items.length]?.focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
        items[(currentIndex - 1 + items.length) % items.length]?.focus();
        break;
      case 'Home':
        event.preventDefault();
        setCurrentIndex(0);
        items[0]?.focus();
        break;
      case 'End':
        event.preventDefault();
        setCurrentIndex(items.length - 1);
        items[items.length - 1]?.focus();
        break;
    }
  }, [currentIndex]);

  return {
    currentIndex,
    registerItem,
    unregisterItem,
    handleKeyDown,
  };
}

// Color contrast validation
export function useColorContrast() {
  const validateContrast = useCallback((foreground: string, background: string, level: 'aa' | 'aaa' = 'aa'): boolean => {
    // Simplified contrast calculation - in production, use a proper library
    const getLuminance = (color: string): number => {
      // Basic luminance calculation for HSL colors
      // This is a simplified version - use a proper color library in production
      return 0.5; // Placeholder
    };

    const contrast = (getLuminance(foreground) + 0.05) / (getLuminance(background) + 0.05);
    const threshold = accessibilityTokens.contrast[level].normal;
    
    return contrast >= threshold;
  }, []);

  return { validateContrast };
}

// Reduced motion detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// High contrast mode detection
export function useHighContrastMode() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
}

// Touch target validation
export function useTouchTarget() {
  const validateTouchTarget = useCallback((element: HTMLElement): boolean => {
    const rect = element.getBoundingClientRect();
    const minSize = parseInt(accessibilityTokens.touch.minimum);
    return rect.width >= minSize && rect.height >= minSize;
  }, []);

  return { validateTouchTarget };
}

// Comprehensive accessibility hook
export function useAccessibility() {
  const focusManagement = useFocusManagement();
  const screenReader = useScreenReaderAnnouncements();
  const keyboardNav = useKeyboardNavigation();
  const colorContrast = useColorContrast();
  const reducedMotion = useReducedMotion();
  const highContrast = useHighContrastMode();
  const touchTarget = useTouchTarget();

  return {
    focus: focusManagement,
    screenReader,
    keyboard: keyboardNav,
    contrast: colorContrast,
    motion: { prefersReducedMotion: reducedMotion },
    highContrast: { isActive: highContrast },
    touch: touchTarget,
  };
}
