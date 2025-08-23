"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Server,
  Database,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Play,
  Pause,
  StopCircle,
  Zap,
  Shield,
  Wifi,
  HardDrive,
  Settings,
  AlertCircle,
  XCircle,
} from "lucide-react";

// Types for Terraform analytics data
interface TerraformAnalyticsData {
  deployments: {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    successRate: number;
    trend: {
      daily: number[];
      weekly: number[];
    };
  };
  resources: {
    total: number;
    created: number;
    updated: number;
    destroyed: number;
    drift: number;
    byType: Record<string, number>;
  };
  costs: {
    current: number;
    previous: number;
    change: number;
    forecast: number;
    breakdown: {
      compute: number;
      storage: number;
      networking: number;
      database: number;
      other: number;
    };
    trend: Array<{ date: string; cost: number }>;
  };
  performance: {
    avgDeployTime: number;
    avgPlanTime: number;
    avgApplyTime: number;
    totalDeployTime: number;
    slowestDeployments: Array<{
      project: string;
      duration: string;
      resources: number;
    }>;
  };
  security: {
    vulnerabilities: number;
    complianceIssues: number;
    secretsExposed: number;
    lastScan: string;
    scanHistory: Array<{
      date: string;
      vulnerabilities: number;
      complianceIssues: number;
    }>;
  };
  recentDeployments: Array<{
    id: string;
    project: string;
    status: string;
    duration: string;
    resources: number;
    timestamp: string;
    user: string;
    error?: string;
    changes: {
      add: number;
      change: number;
      destroy: number;
    };
  }>;
  resourceTypes: Array<{
    type: string;
    count: number;
    cost: number;
    region: string;
  }>;
  driftAnalysis: {
    totalResources: number;
    driftedResources: number;
    driftPercentage: number;
    criticalDrifts: number;
    recentDrifts: Array<{
      resource: string;
      type: string;
      expected: string;
      actual: string;
    }>;
  };
  compliance: {
    overallScore: number;
    policies: Array<{
      name: string;
      score: number;
      status: string;
    }>;
    violations: Array<{
      policy: string;
      resource: string;
      issue: string;
    }>;
  };
}

// Live monitoring interfaces
interface LiveMetric {
  id: string;
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  lastUpdate: Date;
  trend: 'up' | 'down' | 'stable';
}

interface SystemAlert {
  id: string;
  type: 'deployment' | 'security' | 'performance' | 'cost';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  protocol: string;
  sourceIP: string;
  destinationIP: string;
  message: string;
  responseTime?: number;
  userCount?: number;
  status: number;
}

interface LiveSystemStatus {
  overall: 'operational' | 'degraded' | 'outage';
  uptime: number;
  activeIncidents: number;
  metrics: LiveMetric[];
  alerts: SystemAlert[];
  logs: LogEntry[];
  deploymentQueue: Array<{
    id: string;
    project: string;
    status: 'queued' | 'running' | 'completed' | 'failed';
    startTime?: Date;
    estimatedCompletion?: Date;
  }>;
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedProject, setSelectedProject] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TerraformAnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Live monitoring state
  const [liveMonitoring, setLiveMonitoring] = useState(true);
  const [systemStatus, setSystemStatus] = useState<LiveSystemStatus>({
    overall: 'operational',
    uptime: 99.8,
    activeIncidents: 0,
    metrics: [
      {
        id: 'cpu',
        name: 'CPU Usage',
        value: '23%',
        status: 'healthy',
        uptime: 99.9,
        lastUpdate: new Date(),
        trend: 'stable'
      },
      {
        id: 'memory',
        name: 'Memory',
        value: '4.2GB',
        status: 'healthy',
        uptime: 99.8,
        lastUpdate: new Date(),
        trend: 'up'
      },
      {
        id: 'disk',
        name: 'Disk I/O',
        value: '12 MB/s',
        status: 'healthy',
        uptime: 100,
        lastUpdate: new Date(),
        trend: 'stable'
      },
      {
        id: 'network',
        name: 'Network',
        value: '1.2 Gbps',
        status: 'healthy',
        uptime: 99.9,
        lastUpdate: new Date(),
        trend: 'down'
      }
    ],
    alerts: [],
    logs: [],
    deploymentQueue: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  // Live monitoring effect with random updates
  useEffect(() => {
    if (!liveMonitoring) return;

    const interval = setInterval(() => {
      setSystemStatus(prev => {
        const newMetrics = prev.metrics.map(metric => {
          // Random value fluctuation
          const baseValues = {
            cpu: { min: 15, max: 85, unit: '%' },
            memory: { min: 3.5, max: 7.8, unit: 'GB' },
            disk: { min: 8, max: 45, unit: ' MB/s' },
            network: { min: 0.8, max: 2.1, unit: ' Gbps' }
          };

          const config = baseValues[metric.id as keyof typeof baseValues];
          if (!config) return metric;

          const newValue = (Math.random() * (config.max - config.min) + config.min).toFixed(1);
          const formattedValue = `${newValue}${config.unit}`;

          // Determine trend
          const currentNum = parseFloat(metric.value);
          const newNum = parseFloat(newValue);
          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (newNum > currentNum * 1.05) trend = 'up';
          else if (newNum < currentNum * 0.95) trend = 'down';

          // 5% chance of warning/critical status
          let status: 'healthy' | 'warning' | 'critical' = 'healthy';
          const randomChance = Math.random();
          if (randomChance < 0.02) status = 'critical'; // 2% critical
          else if (randomChance < 0.05) status = 'warning'; // 3% warning

          return {
            ...metric,
            value: formattedValue,
            status,
            lastUpdate: new Date(),
            trend,
            uptime: status === 'critical' ? Math.max(metric.uptime - 0.1, 95) : 
                   status === 'warning' ? Math.max(metric.uptime - 0.05, 98) :
                   Math.min(metric.uptime + 0.01, 100)
          };
        });

        // Generate new log entries
        const generateRandomIP = () => 
          `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        
        const protocols = ['HTTPS', 'HTTP', 'TCP', 'UDP', 'WebSocket'];
        const logTypes: ('INFO' | 'WARNING' | 'ERROR' | 'SUCCESS')[] = ['INFO', 'WARNING', 'ERROR', 'SUCCESS'];
        const messages = {
          INFO: ['Connection established', 'Request processed', 'User authenticated', 'Cache hit'],
          SUCCESS: ['Deployment successful', 'Security scan passed', 'Backup completed', 'Health check passed'],
          WARNING: ['High CPU usage detected', 'Memory threshold exceeded', 'Slow response time', 'Rate limit approaching'],
          ERROR: ['Connection timeout', 'Authentication failed', 'Service unavailable', 'Database error']
        };

        const newLogs = [...prev.logs];
        
        // Generate 1-3 new log entries per interval
        const logCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < logCount; i++) {
          const logType = Math.random() < 0.7 ? 'INFO' : 
                         Math.random() < 0.15 ? 'SUCCESS' :
                         Math.random() < 0.1 ? 'WARNING' : 'ERROR';
          
          const protocol = protocols[Math.floor(Math.random() * protocols.length)];
          const messageOptions = messages[logType];
          const message = messageOptions[Math.floor(Math.random() * messageOptions.length)];

          newLogs.unshift({
            id: `log-${Date.now()}-${i}`,
            timestamp: new Date(),
            type: logType,
            protocol,
            sourceIP: generateRandomIP(),
            destinationIP: generateRandomIP(),
            message,
            responseTime: Math.floor(Math.random() * 200) + 10,
            userCount: Math.floor(Math.random() * 5000) + 100,
            status: logType === 'ERROR' ? Math.floor(Math.random() * 100) + 400 :
                   logType === 'WARNING' ? Math.floor(Math.random() * 100) + 300 :
                   Math.floor(Math.random() * 100) + 200
          });
        }

        // Keep only last 50 logs for performance
        if (newLogs.length > 50) {
          newLogs.splice(50);
        }

        // Generate alerts for critical/warning metrics
        const newAlerts = [...prev.alerts];
        newMetrics.forEach(metric => {
          if ((metric.status === 'critical' || metric.status === 'warning') && 
              !newAlerts.some(alert => alert.id.includes(metric.id) && !alert.resolved)) {
            
            const alertTypes = ['deployment', 'security', 'performance', 'cost'] as const;
            const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
            
            const messages = {
              deployment: `${metric.name} spike detected during deployment`,
              security: `Security scan triggered by ${metric.name} anomaly`,
              performance: `${metric.name} performance degradation`,
              cost: `${metric.name} usage may impact cost projections`
            };

            newAlerts.push({
              id: `${metric.id}-${Date.now()}`,
              type: alertType,
              message: messages[alertType],
              severity: metric.status === 'critical' ? 'critical' : 'medium',
              timestamp: new Date(),
              resolved: false
            });
          }
        });

        // Auto-resolve some alerts randomly (20% chance per interval)
        newAlerts.forEach(alert => {
          if (!alert.resolved && Math.random() < 0.2) {
            alert.resolved = true;
            alert.resolvedAt = new Date();
          }
        });

        const activeIncidents = newAlerts.filter(alert => !alert.resolved).length;
        const overallStatus = activeIncidents > 2 ? 'outage' : 
                             activeIncidents > 0 ? 'degraded' : 'operational';

        return {
          ...prev,
          metrics: newMetrics,
          alerts: newAlerts,
          logs: newLogs,
          activeIncidents,
          overall: overallStatus,
          uptime: overallStatus === 'operational' ? Math.min(prev.uptime + 0.01, 99.99) :
                 Math.max(prev.uptime - 0.05, 95)
        };
      });
    }, Math.random() * 2000 + 1000); // Random interval between 1-3 seconds

    return () => clearInterval(interval);
  }, [liveMonitoring]);

  const resolveAlert = (alertId: string) => {
    setSystemStatus(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.id === alertId 
          ? { ...alert, resolved: true, resolvedAt: new Date() }
          : alert
      )
    }));
  };

  const resolveAllAlerts = () => {
    setSystemStatus(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert => 
        alert.resolved ? alert : { ...alert, resolved: true, resolvedAt: new Date() }
      )
    }));
  };

  const triggerDeployment = () => {
    const deploymentId = `deploy-${Date.now()}`;
    setSystemStatus(prev => ({
      ...prev,
      deploymentQueue: [
        ...prev.deploymentQueue,
        {
          id: deploymentId,
          project: `Project-${Math.floor(Math.random() * 100)}`,
          status: 'queued',
          startTime: new Date(),
          estimatedCompletion: new Date(Date.now() + Math.random() * 300000 + 120000) // 2-7 minutes
        }
      ]
    }));

    // Simulate deployment progression
    setTimeout(() => {
      setSystemStatus(prev => ({
        ...prev,
        deploymentQueue: prev.deploymentQueue.map(deploy => 
          deploy.id === deploymentId 
            ? { ...deploy, status: 'running' }
            : deploy
        )
      }));
    }, 2000);

    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      setSystemStatus(prev => ({
        ...prev,
        deploymentQueue: prev.deploymentQueue.map(deploy => 
          deploy.id === deploymentId 
            ? { ...deploy, status: success ? 'completed' : 'failed' }
            : deploy
        )
      }));
    }, Math.random() * 10000 + 5000); // 5-15 seconds
  };

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    fetchAnalyticsData();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading && !data) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading analytics data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="mb-4">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error loading analytics
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No analytics data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Terraform Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor infrastructure deployments, costs, and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { id: "overview", label: "Overview", icon: Activity },
            { id: "costs", label: "Costs & Trends", icon: DollarSign },
            { id: "deployments", label: "Deployments", icon: Server },
            { id: "security", label: "Security & Compliance", icon: Shield },
            { id: "monitoring", label: "Live Monitoring", icon: Wifi },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Successful Deployments
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.deployments.successful}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">
                  {data.deployments.successRate}%
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  success rate
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Resources
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.resources.total.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-blue-600 dark:text-blue-400">+45</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  this week
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Cost
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${data.costs.current.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span
                  className={
                    data.costs.change > 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }
                >
                  {data.costs.change > 0 ? "+" : ""}
                  {data.costs.change}%
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  vs last month
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Deploy Time
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.performance.avgDeployTime}m
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-green-600 dark:text-green-400">-1.2m</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  vs last week
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="flex items-center gap-3 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                <Play className="w-4 h-4" />
                Run Terraform Plan
              </button>
              <button className="flex items-center gap-3 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
                <Activity className="w-4 h-4" />
                Check Drift
              </button>
              <button className="flex items-center gap-3 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "costs" && (
        <div className="space-y-8">
          {/* Cost Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cost Trend
              </h3>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Last 7 days
                </span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {data.costs.trend.map((day, index) => {
                const maxCost = Math.max(...data.costs.trend.map((d) => d.cost));
                const height = (day.cost / maxCost) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {new Date(day.date).toLocaleDateString(undefined, {
                        weekday: "short",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cost Breakdown
              </h3>
              <div className="space-y-4">
                {Object.entries(data.costs.breakdown).map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {category}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cost Forecast
              </h3>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${data.costs.forecast.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Projected next month
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "deployments" && (
        <div className="space-y-8">
          {/* Recent Deployments Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Deployments
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Resources
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      User
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.recentDeployments.map((deployment) => (
                    <tr key={deployment.id}>
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {deployment.project}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            deployment.status
                          )}`}
                        >
                          {deployment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {deployment.duration}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {deployment.resources}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {deployment.user}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(deployment.timestamp).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Average Deploy Time
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {data.performance.avgDeployTime}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Average Plan Time
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {data.performance.avgPlanTime}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Deploy Time
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {data.performance.totalDeployTime}h
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Slowest Deployments
              </h3>
              <div className="space-y-3">
                {data.performance.slowestDeployments.map((deployment, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {deployment.project}
                      </span>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {deployment.resources} resources
                      </p>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {deployment.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="space-y-8">
          {/* Security Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Security Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Vulnerabilities
                  </span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {data.security.vulnerabilities}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Compliance Issues
                  </span>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    {data.security.complianceIssues}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Secrets Exposed
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {data.security.secretsExposed}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Last scan: {data.security.lastScan}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Compliance Overview
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Overall Score
                  </span>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    {data.compliance.overallScore}%
                  </span>
                </div>
                <div className="space-y-3">
                  {data.compliance.policies.map((policy, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {policy.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            policy.status === "compliant"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {policy.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Drift Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Drift Analysis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Resources
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {data.driftAnalysis.totalResources.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Drifted Resources
                  </span>
                  <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    {data.driftAnalysis.driftedResources}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Critical Drifts
                  </span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {data.driftAnalysis.criticalDrifts}
                  </span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Recent Drifts
                </h4>
                <div className="space-y-2">
                  {data.driftAnalysis.recentDrifts
                    .slice(0, 3)
                    .map((drift, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-600 dark:text-gray-400"
                      >
                        <div className="font-medium">{drift.resource}</div>
                        <div>
                          Expected: {drift.expected} → Actual: {drift.actual}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "monitoring" && (
              <div className={`w-2 h-2 rounded-full ${
                systemStatus.overall === 'operational' ? 'bg-green-500' :
                systemStatus.overall === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
              } animate-pulse`}></div>
              {systemStatus.overall === 'operational' ? 'All Systems Operational' :
               systemStatus.overall === 'degraded' ? 'Degraded Performance' : 'Service Outage'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Uptime: <span className="font-mono font-bold text-green-600">{systemStatus.uptime.toFixed(2)}%</span>
            </div>
            <button
              onClick={() => setLiveMonitoring(!liveMonitoring)}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                liveMonitoring 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
              }`}
            >
              <Wifi className="w-4 h-4" />
              {liveMonitoring ? 'Live' : 'Paused'}
            </button>
            <button
              onClick={triggerDeployment}
              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <Zap className="w-4 h-4" />
              Deploy
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {systemStatus.metrics.map((metric) => (
            <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.name}</h3>
                <div className={`flex items-center gap-1 ${
                  metric.status === 'healthy' ? 'text-green-500' :
                  metric.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {metric.status === 'healthy' ? <CheckCircle className="w-4 h-4" /> :
                   metric.status === 'warning' ? <AlertTriangle className="w-4 h-4" /> :
                   <XCircle className="w-4 h-4" />}
                  {metric.trend === 'up' ? <TrendingUp className="w-3 h-3" /> :
                   metric.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                   <div className="w-3 h-3 border-b border-gray-400"></div>}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {metric.uptime.toFixed(1)}% uptime
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  {metric.lastUpdate.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Log Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Real-time Logs */}
          <div className="bg-white text-gray-800 rounded-lg p-4 font-mono text-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Live Feed
              </h3>
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-xs">LIVE</span>
              </div>
            </div>
            <div className="h-96 overflow-y-auto space-y-1 custom-scrollbar">
              {systemStatus.logs.map((log, index) => (
                <div
                  key={log.id}
                  className={`p-2 rounded text-xs border-l-2 ${
                    log.type === 'ERROR' ? 'border-red-500 bg-red-50 text-red-800' :
                    log.type === 'WARNING' ? 'border-yellow-500 bg-yellow-50 text-yellow-800' :
                    log.type === 'SUCCESS' ? 'border-green-500 bg-green-50 text-green-800' :
                    'border-blue-500 bg-blue-50 text-blue-800'
                  } ${index === 0 ? 'animate-pulse' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.type === 'ERROR' ? 'bg-red-600 text-white' :
                      log.type === 'WARNING' ? 'bg-yellow-600 text-white' :
                      log.type === 'SUCCESS' ? 'bg-green-600 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {log.type} - {log.protocol}
                    </span>
                    <span className="text-gray-500">
                      {(Date.now() - log.timestamp.getTime()) < 1000 ? '0s ago' :
                       `${Math.floor((Date.now() - log.timestamp.getTime()) / 1000)}s ago`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Source IP:</span>
                      <div className="font-mono">{log.sourceIP}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Destination IP:</span>
                      <div className="font-mono">{log.destinationIP}</div>
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className="text-gray-500">Message:</span>
                    <div>{log.message}</div>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-xs">
                    <span>Response: {log.responseTime}ms</span>
                    <span>Users: {log.userCount}</span>
                    <span>Status: {log.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              System Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Successful Requests</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {systemStatus.logs.filter(log => log.type === 'SUCCESS' || log.type === 'INFO').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Warnings</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">
                  {systemStatus.logs.filter(log => log.type === 'WARNING').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Errors</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {systemStatus.logs.filter(log => log.type === 'ERROR').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Avg Response Time</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {systemStatus.logs.length > 0 
                    ? Math.round(systemStatus.logs.reduce((acc, log) => acc + (log.responseTime || 0), 0) / systemStatus.logs.length)
                    : 0}ms
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Active Users</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {systemStatus.logs.length > 0 
                    ? Math.max(...systemStatus.logs.map(log => log.userCount || 0))
                    : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        {systemStatus.alerts.filter(alert => !alert.resolved).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Active Alerts ({systemStatus.alerts.filter(alert => !alert.resolved).length})
              </h3>
              <button
                onClick={resolveAllAlerts}
                className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Resolve All
              </button>
            </div>
            <div className="space-y-3">
              {systemStatus.alerts.filter(alert => !alert.resolved).map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                  alert.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  alert.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                        alert.type === 'deployment' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        alert.type === 'security' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        alert.type === 'performance' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {alert.type}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{alert.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-xs font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deployment Queue */}
        {systemStatus.deploymentQueue.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Deployment Queue ({systemStatus.deploymentQueue.length})
            </h3>
            <div className="space-y-3">
              {systemStatus.deploymentQueue.map((deployment) => (
                <div key={deployment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      deployment.status === 'completed' ? 'bg-green-500' :
                      deployment.status === 'failed' ? 'bg-red-500' :
                      deployment.status === 'running' ? 'bg-blue-500 animate-pulse' :
                      'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{deployment.project}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{deployment.status}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {deployment.startTime && (
                      <span>{deployment.startTime.toLocaleTimeString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Deployment Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.deployments.successRate}%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400">+2.1%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              vs last period
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Resources
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.resources.total.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600 dark:text-blue-400">+45</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              this week
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Cost
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${data.costs.current.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span
              className={
                data.costs.change > 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }
            >
              {data.costs.change > 0 ? "+" : ""}
              {data.costs.change}%
            </span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              vs last month
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Deploy Time
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data.performance.avgDeployTime}m
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 dark:text-green-400">-1.2m</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              vs last week
            </span>
          </div>
        </div>
      </div>

      {/* Charts and Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cost Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cost Trend
            </h3>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last 7 days
              </span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.costs.trend.map((day, index) => {
              const maxCost = Math.max(...data.costs.trend.map((d) => d.cost));
              const height = (day.cost / maxCost) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    ${day.cost.toFixed(0)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resource Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Resource Distribution
            </h3>
            <PieChart className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-4">
            {data.resourceTypes.map((resource, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {resource.type}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {resource.count}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    ${resource.cost.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Deployments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Deployments
          </h3>
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Deployment
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Project
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Duration
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Resources
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              {data.recentDeployments.map((deployment) => (
                <tr
                  key={deployment.id}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(deployment.status)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {deployment.id}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {deployment.project}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                        deployment.status
                      )}`}
                    >
                      {deployment.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {deployment.duration}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {deployment.resources}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {deployment.user}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(deployment.timestamp).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Drift Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Drift Analysis
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Resources
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {data.driftAnalysis.totalResources.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Drifted Resources
              </span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {data.driftAnalysis.driftedResources}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Drift Percentage
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {data.driftAnalysis.driftPercentage}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Critical Drifts
              </span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {data.driftAnalysis.criticalDrifts}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Recent Drifts
              </h4>
              <div className="space-y-2">
                {data.driftAnalysis.recentDrifts
                  .slice(0, 3)
                  .map((drift, index) => (
                    <div
                      key={index}
                      className="text-xs text-gray-600 dark:text-gray-400"
                    >
                      <div className="font-medium">{drift.resource}</div>
                      <div>
                        Expected: {drift.expected} → Actual: {drift.actual}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Compliance Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Overall Score
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {data.compliance.overallScore}%
              </span>
            </div>
            <div className="space-y-3">
              {data.compliance.policies.map((policy, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {policy.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        policy.status === "compliant"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {policy.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {data.compliance.violations.length > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Recent Violations
                </h4>
                <div className="space-y-2">
                  {data.compliance.violations
                    .slice(0, 2)
                    .map((violation, index) => (
                      <div
                        key={index}
                        className="text-xs text-red-600 dark:text-red-400"
                      >
                        <div className="font-medium">{violation.resource}</div>
                        <div>{violation.issue}</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Security and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Vulnerabilities
              </span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                {data.security.vulnerabilities}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Compliance Issues
              </span>
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                {data.security.complianceIssues}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Secrets Exposed
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {data.security.secretsExposed}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last scan: {data.security.lastScan}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
              <Play className="w-4 h-4" />
              Run Terraform Plan
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors">
              <Activity className="w-4 h-4" />
              Check Drift
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
