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
        id: '1',
        name: 'API Response Time',
        value: '142ms',
        status: 'healthy',
        uptime: 99.9,
        lastUpdate: new Date(),
        trend: 'stable'
      },
      {
        id: '2',
        name: 'Database Connections',
        value: '45/100',
        status: 'healthy',
        uptime: 99.8,
        lastUpdate: new Date(),
        trend: 'up'
      },
      {
        id: '3',
        name: 'Memory Usage',
        value: '68%',
        status: 'warning',
        uptime: 99.5,
        lastUpdate: new Date(),
        trend: 'down'
      },
      {
        id: '4',
        name: 'CPU Load',
        value: '42%',
        status: 'healthy',
        uptime: 99.9,
        lastUpdate: new Date(),
        trend: 'stable'
      }
    ],
    alerts: [
      {
        id: '1',
        type: 'performance',
        message: 'High memory usage detected on production server',
        severity: 'medium',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        resolved: false
      },
      {
        id: '2',
        type: 'deployment',
        message: 'Deployment queue is processing slower than usual',
        severity: 'low',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        resolved: false
      }
    ],
    logs: [
      {
        id: '1',
        timestamp: new Date(),
        type: 'INFO',
        protocol: 'HTTPS',
        sourceIP: '192.168.1.100',
        destinationIP: '10.0.0.1',
        message: 'GET /api/health',
        responseTime: 45,
        status: 200
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000),
        type: 'SUCCESS',
        protocol: 'HTTPS',
        sourceIP: '192.168.1.101',
        destinationIP: '10.0.0.1',
        message: 'POST /api/deploy',
        responseTime: 1200,
        status: 201
      }
    ],
    deploymentQueue: [
      {
        id: '1',
        project: 'web-app-prod',
        status: 'running',
        startTime: new Date(Date.now() - 5 * 60 * 1000)
      },
      {
        id: '2',
        project: 'api-service',
        status: 'queued'
      }
    ]
  });

  // Mock data for demonstration
  useEffect(() => {
    setData({
      deployments: {
        total: 124,
        successful: 118,
        failed: 6,
        pending: 3,
        successRate: 95.2,
        trend: {
          daily: [12, 15, 8, 18, 22, 19, 14],
          weekly: [85, 92, 88, 95, 91, 89, 96]
        }
      },
      resources: {
        total: 1247,
        created: 45,
        updated: 23,
        destroyed: 8,
        drift: 12,
        byType: {
          "EC2 Instance": 245,
          "S3 Bucket": 89,
          "RDS Database": 34,
          "Lambda Function": 156,
          "Security Group": 78,
          "VPC": 12,
          "Load Balancer": 23
        }
      },
      costs: {
        current: 8457,
        previous: 7892,
        change: 7.2,
        forecast: 9100,
        breakdown: {
          compute: 3245,
          storage: 1876,
          networking: 1234,
          database: 1567,
          other: 535
        },
        trend: [
          { date: "2024-01-01", cost: 7800 },
          { date: "2024-01-02", cost: 8100 },
          { date: "2024-01-03", cost: 8300 },
          { date: "2024-01-04", cost: 8200 },
          { date: "2024-01-05", cost: 8500 },
          { date: "2024-01-06", cost: 8400 },
          { date: "2024-01-07", cost: 8457 }
        ]
      },
      performance: {
        avgDeployTime: 12.5,
        avgPlanTime: 3.2,
        avgApplyTime: 9.3,
        totalDeployTime: 156,
        slowestDeployments: [
          { project: "legacy-migration", duration: "45m 32s", resources: 156 },
          { project: "db-cluster-setup", duration: "38m 12s", resources: 89 },
          { project: "vpc-peering", duration: "28m 45s", resources: 67 }
        ]
      },
      security: {
        vulnerabilities: 3,
        complianceIssues: 8,
        secretsExposed: 0,
        lastScan: "2 hours ago",
        scanHistory: []
      },
      recentDeployments: [
        {
          id: "1",
          project: "web-app-frontend",
          status: "success",
          duration: "8m 23s",
          resources: 12,
          timestamp: "2024-01-07T14:30:00Z",
          user: "john.doe@company.com",
          changes: { add: 3, change: 8, destroy: 1 }
        },
        {
          id: "2",
          project: "api-backend",
          status: "failed",
          duration: "15m 45s",
          resources: 8,
          timestamp: "2024-01-07T13:15:00Z",
          user: "jane.smith@company.com",
          error: "Terraform apply failed: Resource conflict",
          changes: { add: 5, change: 3, destroy: 0 }
        },
        {
          id: "3",
          project: "database-migration",
          status: "running",
          duration: "22m 12s",
          resources: 24,
          timestamp: "2024-01-07T12:45:00Z",
          user: "bob.wilson@company.com",
          changes: { add: 20, change: 4, destroy: 0 }
        }
      ],
      resourceTypes: [],
      driftAnalysis: {
        totalResources: 1247,
        driftedResources: 12,
        driftPercentage: 0.96,
        criticalDrifts: 2,
        recentDrifts: [
          {
            resource: "aws_instance.web_server",
            type: "EC2 Instance",
            expected: "t3.medium",
            actual: "t3.large"
          },
          {
            resource: "aws_s3_bucket.logs",
            type: "S3 Bucket",
            expected: "versioning=true",
            actual: "versioning=false"
          }
        ]
      },
      compliance: {
        overallScore: 87,
        policies: [
          { name: "Encryption at Rest", score: 95, status: "compliant" },
          { name: "Access Controls", score: 92, status: "compliant" },
          { name: "Network Security", score: 78, status: "non-compliant" },
          { name: "Data Retention", score: 88, status: "compliant" }
        ],
        violations: [
          {
            policy: "Network Security",
            resource: "aws_security_group.web",
            issue: "Unrestricted ingress on port 22"
          }
        ]
      }
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const fetchAnalyticsData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const refreshData = () => {
    fetchAnalyticsData();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <RefreshCw className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Loading analytics data...
          </p>
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
        <div className="space-y-8">
          {/* Live System Status */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Live System Status</h2>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  systemStatus.overall === 'operational' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : systemStatus.overall === 'degraded'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
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

            {/* Active Alerts */}
            {systemStatus.alerts.filter(alert => !alert.resolved).length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Active Alerts ({systemStatus.alerts.filter(alert => !alert.resolved).length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {systemStatus.alerts.filter(alert => !alert.resolved).slice(0, 5).map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                      alert.severity === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' :
                      alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                      'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {alert.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {alert.timestamp.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
