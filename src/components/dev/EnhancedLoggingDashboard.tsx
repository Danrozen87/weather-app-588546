/**
 * @file EnhancedLoggingDashboard.tsx
 * @purpose Advanced development dashboard with all monitoring capabilities
 * @performance Optimized for real-time insights
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Typography, Stack } from '@/design-system';
import { logger, type LogEntry, type LogLevel } from '@/lib/utils/logger';
import { errorReporter } from '@/lib/utils/errorReporting';
import { performanceMonitor } from '@/lib/utils/performanceMonitor';
import { errorGrouper } from '@/lib/utils/intelligentErrorGrouping';
import { sessionReplayRecorder } from '@/lib/utils/sessionReplay';
import { 
  X, 
  Trash2, 
  Download, 
  Filter, 
  Activity, 
  AlertTriangle, 
  Info, 
  Bug, 
  Zap,
  Search,
  TrendingUp,
  Users,
  Clock,
  Eye
} from 'lucide-react';

const EnhancedLoggingDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [errorQueueStatus, setErrorQueueStatus] = useState({ errors: 0, performance: 0, userActions: 0 });
  const [performanceMetrics, setPerformanceMetrics] = useState(performanceMonitor.getMetrics());
  const [errorGroups, setErrorGroups] = useState(errorGrouper.getAllGroups());
  const [sessionSummary, setSessionSummary] = useState(sessionReplayRecorder.getSessionSummary());

  // Toggle visibility with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update all data sources
  const updateData = useCallback(() => {
    setLogs(logger.getStoredLogs());
    setErrorQueueStatus(errorReporter.getQueueStatus());
    setPerformanceMetrics(performanceMonitor.getMetrics());
    setErrorGroups(errorGrouper.getAllGroups());
    setSessionSummary(sessionReplayRecorder.getSessionSummary());
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    updateData();
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, [isVisible, updateData]);

  const filteredLogs = useMemo(() => {
    let filtered = logs;
    
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(term) ||
        log.component?.toLowerCase().includes(term) ||
        JSON.stringify(log.context || {}).toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [logs, selectedLevel, searchTerm]);

  const logStats = useMemo(() => {
    const stats = logs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<LogLevel, number>);

    return {
      error: stats.error || 0,
      warn: stats.warn || 0,
      info: stats.info || 0,
      debug: stats.debug || 0,
      trace: stats.trace || 0,
      total: logs.length,
    };
  }, [logs]);

  const performanceInsights = useMemo(() => {
    return performanceMonitor.getInsights();
  }, [performanceMetrics]);

  const errorInsights = useMemo(() => {
    return errorGrouper.getInsights();
  }, [errorGroups]);

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      case 'warn': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      case 'debug': return <Bug className="h-4 w-4" />;
      case 'trace': return <Activity className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case 'error': return 'destructive';
      case 'warn': return 'secondary';
      case 'info': return 'default';
      case 'debug': return 'outline';
      case 'trace': return 'outline';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'default';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const exportAllData = () => {
    const data = {
      logs,
      performanceMetrics,
      errorGroups,
      sessionData: sessionReplayRecorder.getSessionData(),
      insights: {
        performance: performanceInsights,
        errors: errorInsights
      },
      exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `enhanced_logs_${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    logger.clearStoredLogs();
    performanceMonitor.clear();
    errorReporter.clearQueues();
    errorGrouper.clear();
    sessionReplayRecorder.clear();
    updateData();
  };

  if (import.meta.env.MODE !== 'development' || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-[28rem] max-h-[85vh] z-50">
      <Card className="p-4 backdrop-blur-sm bg-background/95 border shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="cardTitle" className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Enhanced Dashboard
          </Typography>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={exportAllData}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAllData}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="performance">Perf</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
            <TabsTrigger value="session">Session</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <Typography variant="small" color="muted">Total Logs</Typography>
                <Typography variant="large">{logStats.total}</Typography>
              </Card>
              <Card className="p-3">
                <Typography variant="small" color="muted">Slow Renders</Typography>
                <Typography variant="large" className="text-destructive">
                  {performanceInsights.slowRenders.length}
                </Typography>
              </Card>
              <Card className="p-3">
                <Typography variant="small" color="muted">Error Groups</Typography>
                <Typography variant="large">{errorGroups.length}</Typography>
              </Card>
              <Card className="p-3">
                <Typography variant="small" color="muted">Session Actions</Typography>
                <Typography variant="large">{sessionSummary.actionCount}</Typography>
              </Card>
            </div>

            {/* Critical Issues */}
            {errorInsights.criticalErrors.length > 0 && (
              <Card className="p-3 border-destructive">
                <Typography variant="small" className="text-destructive font-semibold mb-2">
                  ð¨ Critical Issues
                </Typography>
                {errorInsights.criticalErrors.slice(0, 3).map((group, index) => (
                  <div key={group.id} className="text-sm mb-2">
                    <Badge variant="destructive" className="mr-2">
                      {group.count}x
                    </Badge>
                    {group.examples[0]?.message.substring(0, 50)}...
                  </div>
                ))}
              </Card>
            )}

            {/* Recommendations */}
            {(performanceInsights.recommendations.length > 0 || errorInsights.recommendedActions.length > 0) && (
              <Card className="p-3">
                <Typography variant="small" className="font-semibold mb-2">
                  ð¡ Recommendations
                </Typography>
                <ScrollArea className="h-24">
                  <div className="space-y-1">
                    {[...performanceInsights.recommendations, ...errorInsights.recommendedActions]
                      .slice(0, 5)
                      .map((rec, index) => (
                        <Typography key={index} variant="small" color="muted">
                          â¢ {rec}
                        </Typography>
                      ))}
                  </div>
                </ScrollArea>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            {/* Search and filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  variant={selectedLevel === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLevel('all')}
                >
                  All ({logStats.total})
                </Button>
                {(['error', 'warn', 'info', 'debug', 'trace'] as LogLevel[]).map(level => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                    className="capitalize"
                  >
                    {level} ({logStats[level]})
                  </Button>
                ))}
              </div>
            </div>

            {/* Logs list */}
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {filteredLogs.slice(-50).reverse().map((log, index) => (
                  <div key={index} className="p-2 rounded border-l-2 border-l-primary/20 bg-muted/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Badge variant={getLevelColor(log.level)} className="flex items-center gap-1">
                          {getLevelIcon(log.level)}
                          {log.level}
                        </Badge>
                        <Typography variant="small" className="truncate">
                          {log.component}
                        </Typography>
                      </div>
                      <Typography variant="small" color="muted">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </Typography>
                    </div>
                    <Typography variant="small" className="mt-1">
                      {log.message}
                    </Typography>
                    {log.context && Object.keys(log.context).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer text-muted-foreground">
                          Context
                        </summary>
                        <pre className="text-xs mt-1 p-2 bg-background rounded overflow-x-auto">
                          {JSON.stringify(log.context, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <Typography variant="small" color="muted">Avg Render</Typography>
                <Typography variant="large">
                  {performanceInsights.averageRenderTime.toFixed(2)}ms
                </Typography>
              </Card>
              <Card className="p-3">
                <Typography variant="small" color="muted">Memory Trend</Typography>
                <Badge variant={performanceInsights.memoryTrend === 'increasing' ? 'destructive' : 'default'}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {performanceInsights.memoryTrend}
                </Badge>
              </Card>
            </div>

            {/* Component hotspots */}
            <Card className="p-3">
              <Typography variant="small" className="font-semibold mb-2">
                Component Hotspots
              </Typography>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {performanceInsights.componentHotspots.map((hotspot, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <Typography variant="small" className="truncate">
                        {hotspot.component}
                      </Typography>
                      <Badge variant={hotspot.averageTime > 16 ? 'destructive' : 'default'}>
                        {hotspot.averageTime.toFixed(1)}ms
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 text-center">
                <Typography variant="small" color="muted">Groups</Typography>
                <Typography variant="large">{errorGroups.length}</Typography>
              </Card>
              <Card className="p-3 text-center">
                <Typography variant="small" color="muted">Critical</Typography>
                <Typography variant="large" className="text-destructive">
                  {errorInsights.criticalErrors.length}
                </Typography>
              </Card>
              <Card className="p-3 text-center">
                <Typography variant="small" color="muted">Users</Typography>
                <Typography variant="large">
                  <Users className="h-4 w-4 inline mr-1" />
                  {errorInsights.affectedUserCount}
                </Typography>
              </Card>
            </div>

            <ScrollArea className="h-48">
              <div className="space-y-2">
                {errorGroups.slice(0, 20).map((group) => (
                  <div key={group.id} className="p-2 rounded bg-muted/50">
                    <div className="flex items-center justify-between">
                      <Badge variant={getSeverityColor(group.severity)}>
                        {group.severity}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {group.count}x
                        </Badge>
                        <Badge variant={group.trend === 'increasing' ? 'destructive' : 'default'}>
                          {group.trend}
                        </Badge>
                      </div>
                    </div>
                    <Typography variant="small" className="mt-1">
                      {group.examples[0]?.message.substring(0, 60)}...
                    </Typography>
                    <Typography variant="small" color="muted">
                      Last: {new Date(group.lastSeen).toLocaleTimeString()}
                    </Typography>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="session" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <Typography variant="small" color="muted">Duration</Typography>
                <Typography variant="large">
                  <Clock className="h-4 w-4 inline mr-1" />
                  {Math.round(sessionSummary.duration / 1000)}s
                </Typography>
              </Card>
              <Card className="p-3">
                <Typography variant="small" color="muted">Actions</Typography>
                <Typography variant="large">
                  <Activity className="h-4 w-4 inline mr-1" />
                  {sessionSummary.actionCount}
                </Typography>
              </Card>
            </div>

            <Card className="p-3">
              <Typography variant="small" className="font-semibold mb-2">
                <Eye className="h-4 w-4 inline mr-1" />
                Session Replay
              </Typography>
              <Typography variant="small" color="muted" className="mb-2">
                Session ID: {sessionSummary.sessionId.substring(0, 20)}...
              </Typography>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const data = sessionReplayRecorder.exportSession();
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `session_${sessionSummary.sessionId}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export Session
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        <Typography variant="small" color="muted" className="mt-4 text-center">
          Press Ctrl+Shift+L to toggle â¢ Enhanced monitoring active
        </Typography>
      </Card>
    </div>
  );
};

export default EnhancedLoggingDashboard;