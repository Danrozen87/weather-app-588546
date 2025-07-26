/**
 * @file consoleReplacer.ts
 * @purpose Replace all console usage with structured logging
 * @performance Zero overhead wrapper that routes to logger
 */

import { logger } from './logger';

type ConsoleMethod = 'log' | 'warn' | 'error' | 'info' | 'debug' | 'trace';

interface ConsoleContext {
  component?: string;
  originalMethod: ConsoleMethod;
  arguments: any[];
}

class StructuredConsole {
  private originalConsole: Console;
  private isReplaced = false;

  constructor() {
    this.originalConsole = { ...console };
  }

  private extractComponentFromStack(): string | undefined {
    const stack = new Error().stack;
    if (!stack) return undefined;

    // Try to find React component in stack trace
    const componentMatch = stack.match(/at (\w+)(?:\s|\()/g);
    if (componentMatch && componentMatch.length > 3) {
      // Skip our wrapper calls and get the actual component
      const component = componentMatch[3]?.replace(/at\s*|\(/g, '').trim();
      if (component && !['Object', 'Module', 'eval'].includes(component)) {
        return component;
      }
    }
    return 'Unknown';
  }

  private formatMessage(args: any[]): string {
    return args.map(arg => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
  }

  private createStructuredMethod(method: ConsoleMethod) {
    return (...args: any[]) => {
      const component = this.extractComponentFromStack();
      const message = this.formatMessage(args);
      
      const context: ConsoleContext = {
        component,
        originalMethod: method,
        arguments: args
      };

      // Map console methods to logger levels
      switch (method) {
        case 'error':
          logger.error(message, context);
          break;
        case 'warn':
          logger.warn(message, context);
          break;
        case 'info':
        case 'log':
          logger.info(message, context);
          break;
        case 'debug':
          logger.debug(message, context);
          break;
        case 'trace':
          logger.trace(message, context);
          break;
      }

      // In development, also call original console for immediate feedback
      if (import.meta.env.MODE === 'development') {
        this.originalConsole[method](...args);
      }
    };
  }

  replaceGlobalConsole(): void {
    if (this.isReplaced) return;

    // Replace console methods with structured versions
    console.log = this.createStructuredMethod('log');
    console.warn = this.createStructuredMethod('warn');
    console.error = this.createStructuredMethod('error');
    console.info = this.createStructuredMethod('info');
    console.debug = this.createStructuredMethod('debug');
    console.trace = this.createStructuredMethod('trace');

    this.isReplaced = true;
    
    if (import.meta.env.MODE === 'development') {
      this.originalConsole.info('ð Console methods replaced with structured logging');
    }
  }

  restoreOriginalConsole(): void {
    if (!this.isReplaced) return;

    Object.assign(console, this.originalConsole);
    this.isReplaced = false;
  }

  // Method to get original console for emergency debugging
  getOriginalConsole(): Console {
    return this.originalConsole;
  }
}

export const structuredConsole = new StructuredConsole();

// Auto-replace console in development
if (import.meta.env.MODE === 'development') {
  structuredConsole.replaceGlobalConsole();
}