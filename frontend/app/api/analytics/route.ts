import { NextResponse } from "next/server";

// Mock Terraform analytics data
const terraformAnalyticsData = {
  deployments: {
    total: 156,
    successful: 142,
    failed: 8,
    pending: 6,
    successRate: 91.0,
    trend: {
      daily: [12, 15, 8, 20, 18, 14, 16],
      weekly: [85, 92, 78, 95, 88, 91, 89],
    },
  },
  resources: {
    total: 2847,
    created: 892,
    updated: 1567,
    destroyed: 388,
    drift: 23,
    byType: {
      aws_instance: 45,
      aws_lambda: 23,
      aws_rds: 12,
      aws_s3: 8,
      aws_cloudfront: 5,
      aws_ecs: 15,
      aws_alb: 7,
      aws_vpc: 3,
    },
  },
  costs: {
    current: 2847.5,
    previous: 2650.25,
    change: 7.4,
    forecast: 3200.0,
    breakdown: {
      compute: 1250.0,
      storage: 456.0,
      networking: 234.5,
      database: 567.0,
      other: 340.0,
    },
    trend: [
      { date: "2024-01-01", cost: 2650.25 },
      { date: "2024-01-02", cost: 2680.5 },
      { date: "2024-01-03", cost: 2720.75 },
      { date: "2024-01-04", cost: 2750.0 },
      { date: "2024-01-05", cost: 2780.25 },
      { date: "2024-01-06", cost: 2810.5 },
      { date: "2024-01-07", cost: 2847.5 },
    ],
  },
  performance: {
    avgDeployTime: 8.5,
    avgPlanTime: 2.3,
    avgApplyTime: 6.2,
    totalDeployTime: 1326.5,
    slowestDeployments: [
      { project: "database-cluster", duration: "45m 23s", resources: 156 },
      { project: "web-app-prod", duration: "23m 12s", resources: 89 },
      { project: "api-gateway", duration: "18m 45s", resources: 67 },
    ],
  },
  security: {
    vulnerabilities: 3,
    complianceIssues: 1,
    secretsExposed: 0,
    lastScan: "2 hours ago",
    scanHistory: [
      { date: "2024-01-15", vulnerabilities: 3, complianceIssues: 1 },
      { date: "2024-01-14", vulnerabilities: 2, complianceIssues: 0 },
      { date: "2024-01-13", vulnerabilities: 4, complianceIssues: 2 },
    ],
  },
  recentDeployments: [
    {
      id: "tf-deploy-001",
      project: "web-app-prod",
      status: "success",
      duration: "12m 34s",
      resources: 45,
      timestamp: "2024-01-15T10:30:00Z",
      user: "alice@company.com",
      changes: {
        add: 12,
        change: 23,
        destroy: 0,
      },
    },
    {
      id: "tf-deploy-002",
      project: "api-gateway",
      status: "failed",
      duration: "8m 12s",
      resources: 23,
      timestamp: "2024-01-15T09:15:00Z",
      user: "bob@company.com",
      error: "Invalid IAM policy configuration",
      changes: {
        add: 5,
        change: 8,
        destroy: 0,
      },
    },
    {
      id: "tf-deploy-003",
      project: "database-cluster",
      status: "success",
      duration: "15m 45s",
      resources: 67,
      timestamp: "2024-01-15T08:00:00Z",
      user: "carol@company.com",
      changes: {
        add: 23,
        change: 34,
        destroy: 10,
      },
    },
    {
      id: "tf-deploy-004",
      project: "monitoring-stack",
      status: "pending",
      duration: "0m 0s",
      resources: 34,
      timestamp: "2024-01-15T11:45:00Z",
      user: "dave@company.com",
      changes: {
        add: 8,
        change: 12,
        destroy: 0,
      },
    },
  ],
  resourceTypes: [
    { type: "aws_instance", count: 45, cost: 1250.0, region: "us-east-1" },
    { type: "aws_lambda", count: 23, cost: 89.5, region: "us-east-1" },
    { type: "aws_rds", count: 12, cost: 456.0, region: "us-east-1" },
    { type: "aws_s3", count: 8, cost: 23.4, region: "us-east-1" },
    { type: "aws_cloudfront", count: 5, cost: 67.8, region: "us-east-1" },
    { type: "aws_ecs", count: 15, cost: 234.5, region: "us-west-2" },
    { type: "aws_alb", count: 7, cost: 156.0, region: "us-east-1" },
    { type: "aws_vpc", count: 3, cost: 45.0, region: "us-east-1" },
  ],
  driftAnalysis: {
    totalResources: 2847,
    driftedResources: 23,
    driftPercentage: 0.8,
    criticalDrifts: 5,
    recentDrifts: [
      {
        resource: "aws_instance.web-server-1",
        type: "instance_type",
        expected: "t3.medium",
        actual: "t3.large",
      },
      {
        resource: "aws_s3.bucket-data",
        type: "versioning",
        expected: "Enabled",
        actual: "Disabled",
      },
      {
        resource: "aws_security_group.web-sg",
        type: "ingress_rules",
        expected: "3 rules",
        actual: "5 rules",
      },
    ],
  },
  compliance: {
    overallScore: 92,
    policies: [
      { name: "Security Groups", score: 95, status: "compliant" },
      { name: "IAM Policies", score: 88, status: "compliant" },
      { name: "S3 Bucket Security", score: 96, status: "compliant" },
      { name: "VPC Configuration", score: 89, status: "compliant" },
    ],
    violations: [
      {
        policy: "Security Groups",
        resource: "sg-web-123",
        issue: "Open port 22 to 0.0.0.0/0",
      },
      {
        policy: "IAM Policies",
        resource: "role-lambda-456",
        issue: "Overly permissive policy",
      },
    ],
  },
};

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(terraformAnalyticsData);
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
