/**
 * @file performanceMonitor.ts
 * @purpose Enhanced performance monitoring with memory management and intelligent analysis
 * @performance Optimized for production use with minimal overhead
 */

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  propsHash: string;
  timestamp: number;
  sessionId: string;
  memoryUsage?: number;
  callStack?: string;
  isSlowRender?: boolean;
}

interface PerformanceInsights {
  slowRenders: PerformanceMetrics[];
  averageRenderTime: number;
  totalRenders: number;
  memoryTrend: 'stable' | 'increasing' | 'decreasing';
  componentHotspots: Array<{ component: string; averageTime: number; count: number }>;
  recommendations: string[];
}

class EnhancedPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly maxMetrics = 500; // Increased for better analysis
  private readonly slowRenderThreshold = 16; // 60fps threshold
  private readonly memoryCheckInterval = 10000; // Check memory every 10s
  private sessionId: string;
  private memoryBaseline?: number;
  private memoryHistory: Array<{ timestamp: number; usage: number }> = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    
    if (import.meta.env.MODE === 'development') {
      this.startMemoryMonitoring();
    }
  }

  private generateSessionId(): string {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private startMemoryMonitoring(): void {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      setInterval(() => {
        const memInfo = (performance as any).memory;
        const usage = memInfo.usedJSHeapSize;
        
        if (!this.memoryBaseline) {
          this.memoryBaseline = usage;
        }
        
        this.memoryHistory.push({
          timestamp: Date.now(),
          usage
        });
        
        // Keep only last 50 memory readings
        if (this.memoryHistory.length > 50) {
          this.memoryHistory = this.memoryHistory.slice(-50);
        }
        
        // Alert on memory spikes
        if (usage > this.memoryBaseline * 2) {
          console.warn(`[Performance] Memory usage spike detected: ${Math.round(usage / 1048576)}MB`);
        }
      }, this.memoryCheckInterval);
    }
  }

  private getCallStack(): string {
    const stack = new Error().stack;
    if (!stack) return '';
    
    const lines = stack.split('\n');
    // Skip our internal calls and get React component stack
    const relevantLines = lines.slice(4, 8);
    return relevantLines.join('\n');
  }

  private getCurrentMemoryUsage(): number | undefined {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return undefined;
  }

  logRender(componentName: string, renderTime: number, propsHash: string): void {
    const isSlowRender = renderTime > this.slowRenderThreshold;
    
    const metric: PerformanceMetrics = {
      renderTime,
      componentName,
      propsHash,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      memoryUsage: this.getCurrentMemoryUsage(),
      callStack: isSlowRender ? this.getCallStack() : undefined,
      isSlowRender
    };

    this.metrics.push(metric);

    // Maintain buffer size with intelligent cleanup
    if (this.metrics.length > this.maxMetrics) {
      // Keep all slow renders and recent metrics
      const slowRenders = this.metrics.filter(m => m.isSlowRender);
      const recentMetrics = this.metrics.slice(-Math.floor(this.maxMetrics * 0.7));
      
      this.metrics = [...slowRenders, ...recentMetrics]
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-this.maxMetrics);
    }

    // Enhanced logging for development
    if (import.meta.env.MODE === 'development') {
      if (isSlowRender) {
        console.warn(
          `[Performance] Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`,
          { 
            renderTime, 
            memoryUsage: metric.memoryUsage ? `${Math.round(metric.memoryUsage / 1048576)}MB` : 'N/A',
            propsHash: propsHash.substring(0, 20) + '...'
          }
        );
      }
      
      // Log performance regression
      const recentSameComponent = this.metrics
        .filter(m => m.componentName === componentName)
        .slice(-5);
      
      if (recentSameComponent.length >= 3) {
        const avgRecent = recentSameComponent.reduce((sum, m) => sum + m.renderTime, 0) / recentSameComponent.length;
        if (avgRecent > this.slowRenderThreshold && renderTime > avgRecent * 1.5) {
          console.warn(`[Performance] Performance regression detected in ${componentName}:`, {
            currentRender: `${renderTime.toFixed(2)}ms`,
            recentAverage: `${avgRecent.toFixed(2)}ms`
          });
        }
      }
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getComponentMetrics(componentName: string): PerformanceMetrics[] {
    return this.metrics.filter(m => m.componentName === componentName);
  }

  getInsights(): PerformanceInsights {
    const slowRenders = this.metrics.filter(m => m.isSlowRender);
    const totalRenders = this.metrics.length;
    const averageRenderTime = totalRenders > 0 
      ? this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / totalRenders 
      : 0;

    // Component performance analysis
    const componentStats = this.metrics.reduce((acc, metric) => {
      if (!acc[metric.componentName]) {
        acc[metric.componentName] = { total: 0, count: 0 };
      }
      acc[metric.componentName].total += metric.renderTime;
      acc[metric.componentName].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    const componentHotspots = Object.entries(componentStats)
      .map(([component, stats]) => ({
        component,
        averageTime: stats.total / stats.count,
        count: stats.count
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 5);

    // Memory trend analysis
    let memoryTrend: 'stable' | 'increasing' | 'decreasing' = 'stable';
    if (this.memoryHistory.length >= 10) {
      const recent = this.memoryHistory.slice(-5);
      const older = this.memoryHistory.slice(-10, -5);
      const recentAvg = recent.reduce((sum, m) => sum + m.usage, 0) / recent.length;
      const olderAvg = older.reduce((sum, m) => sum + m.usage, 0) / older.length;
      
      if (recentAvg > olderAvg * 1.1) {
        memoryTrend = 'increasing';
      } else if (recentAvg < olderAvg * 0.9) {
        memoryTrend = 'decreasing';
      }
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (slowRenders.length > totalRenders * 0.1) {
      recommendations.push('Consider optimizing components with React.memo() or useMemo()');
    }
    
    if (componentHotspots.length > 0 && componentHotspots[0].averageTime > 20) {
      recommendations.push(`Focus optimization on ${componentHotspots[0].component} component`);
    }
    
    if (memoryTrend === 'increasing') {
      recommendations.push('Memory usage is increasing - check for memory leaks');
    }
    
    if (averageRenderTime > 10) {
      recommendations.push('Overall render performance could be improved');
    }

    return {
      slowRenders,
      averageRenderTime,
      totalRenders,
      memoryTrend,
      componentHotspots,
      recommendations
    };
  }

  clear(): void {
    this.metrics = [];
    this.memoryHistory = [];
    this.memoryBaseline = undefined;
  }

  // Export metrics for analysis
  exportMetrics(): string {
    const insights = this.getInsights();
    const data = {
      metrics: this.metrics,
      insights,
      memoryHistory: this.memoryHistory,
      sessionId: this.sessionId,
      exportTime: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  // Memory management
  optimizeMemory(): void {
    // Keep only critical metrics
    const criticalMetrics = this.metrics.filter(m => 
      m.isSlowRender || 
      Date.now() - m.timestamp < 300000 // Last 5 minutes
    );
    
    this.metrics = criticalMetrics.slice(-200); // Keep max 200 critical metrics
    
    // Trim memory history
    this.memoryHistory = this.memoryHistory.slice(-20);
  }
}

// Enhanced measure render function with better performance tracking
export function measureRender<T extends Record<string, any>>(
  componentName: string,
  props: T,
  renderFn: () => React.ReactElement
): React.ReactElement {
  if (import.meta.env.MODE === 'development') {
    const start = performance.now();
    const result = renderFn();
    const end = performance.now();
    
    const propsHash = JSON.stringify(props, (key, value) => {
      // Optimize hash generation for large objects
      if (typeof value === 'function') return '[Function]';
      if (typeof value === 'object' && value !== null) {
        return Object.keys(value).length > 10 ? '[Large Object]' : value;
      }
      return value;
    });
    
    performanceMonitor.logRender(componentName, end - start, propsHash);
    
    return result;
  }
  
  return renderFn();
}

export const performanceMonitor = new EnhancedPerformanceMonitor();
export type { PerformanceMetrics, PerformanceInsights };
