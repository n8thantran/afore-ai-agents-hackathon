from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import json
from datetime import datetime, timedelta
import random

app = FastAPI(title="Terraform Analytics API", version="1.0.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock data models
class DeploymentMetrics(BaseModel):
    total: int
    successful: int
    failed: int
    pending: int
    success_rate: float

class ResourceMetrics(BaseModel):
    total: int
    created: int
    updated: int
    destroyed: int
    drift: int

class CostMetrics(BaseModel):
    current: float
    previous: float
    change: float
    forecast: float

class SecurityMetrics(BaseModel):
    vulnerabilities: int
    compliance_issues: int
    secrets_exposed: int
    last_scan: str

# Mock data generator
def generate_mock_analytics_data():
    """Generate realistic Terraform analytics data"""
    
    # Generate cost trend data for the last 7 days
    base_cost = 2650.25
    cost_trend = []
    for i in range(7):
        date = (datetime.now() - timedelta(days=6-i)).strftime("%Y-%m-%d")
        cost = base_cost + random.uniform(-50, 100) + (i * 30)
        cost_trend.append({"date": date, "cost": round(cost, 2)})
    
    # Generate recent deployments
    deployment_statuses = ["success", "failed", "pending"]
    projects = ["web-app-prod", "api-gateway", "database-cluster", "monitoring-stack", "auth-service"]
    users = ["alice@company.com", "bob@company.com", "carol@company.com", "dave@company.com"]
    
    recent_deployments = []
    for i in range(4):
        status = random.choice(deployment_statuses)
        duration = f"{random.randint(5, 25)}m {random.randint(0, 59)}s" if status != "pending" else "0m 0s"
        timestamp = (datetime.now() - timedelta(hours=random.randint(1, 24))).isoformat() + "Z"
        
        deployment = {
            "id": f"tf-deploy-{str(i+1).zfill(3)}",
            "project": random.choice(projects),
            "status": status,
            "duration": duration,
            "resources": random.randint(20, 100),
            "timestamp": timestamp,
            "user": random.choice(users),
            "changes": {
                "add": random.randint(0, 30),
                "change": random.randint(0, 50),
                "destroy": random.randint(0, 15)
            }
        }
        
        if status == "failed":
            deployment["error"] = "Invalid IAM policy configuration"
            
        recent_deployments.append(deployment)
    
    return {
        "deployments": {
            "total": 156,
            "successful": 142,
            "failed": 8,
            "pending": 6,
            "successRate": 91.0,
            "trend": {
                "daily": [12, 15, 8, 20, 18, 14, 16],
                "weekly": [85, 92, 78, 95, 88, 91, 89]
            }
        },
        "resources": {
            "total": 2847,
            "created": 892,
            "updated": 1567,
            "destroyed": 388,
            "drift": 23,
            "byType": {
                "aws_instance": 45,
                "aws_lambda": 23,
                "aws_rds": 12,
                "aws_s3": 8,
                "aws_cloudfront": 5,
                "aws_ecs": 15,
                "aws_alb": 7,
                "aws_vpc": 3
            }
        },
        "costs": {
            "current": 2847.50,
            "previous": 2650.25,
            "change": 7.4,
            "forecast": 3200.00,
            "breakdown": {
                "compute": 1250.00,
                "storage": 456.00,
                "networking": 234.50,
                "database": 567.00,
                "other": 340.00
            },
            "trend": cost_trend
        },
        "performance": {
            "avgDeployTime": 8.5,
            "avgPlanTime": 2.3,
            "avgApplyTime": 6.2,
            "totalDeployTime": 1326.5,
            "slowestDeployments": [
                {"project": "database-cluster", "duration": "45m 23s", "resources": 156},
                {"project": "web-app-prod", "duration": "23m 12s", "resources": 89},
                {"project": "api-gateway", "duration": "18m 45s", "resources": 67}
            ]
        },
        "security": {
            "vulnerabilities": random.randint(0, 5),
            "complianceIssues": random.randint(0, 3),
            "secretsExposed": 0,
            "lastScan": "2 hours ago",
            "scanHistory": [
                {"date": "2024-01-15", "vulnerabilities": 3, "complianceIssues": 1},
                {"date": "2024-01-14", "vulnerabilities": 2, "complianceIssues": 0},
                {"date": "2024-01-13", "vulnerabilities": 4, "complianceIssues": 2}
            ]
        },
        "recentDeployments": recent_deployments,
        "resourceTypes": [
            {"type": "aws_instance", "count": 45, "cost": 1250.00, "region": "us-east-1"},
            {"type": "aws_lambda", "count": 23, "cost": 89.50, "region": "us-east-1"},
            {"type": "aws_rds", "count": 12, "cost": 456.00, "region": "us-east-1"},
            {"type": "aws_s3", "count": 8, "cost": 23.40, "region": "us-east-1"},
            {"type": "aws_cloudfront", "count": 5, "cost": 67.80, "region": "us-east-1"},
            {"type": "aws_ecs", "count": 15, "cost": 234.50, "region": "us-west-2"},
            {"type": "aws_alb", "count": 7, "cost": 156.00, "region": "us-east-1"},
            {"type": "aws_vpc", "count": 3, "cost": 45.00, "region": "us-east-1"}
        ],
        "driftAnalysis": {
            "totalResources": 2847,
            "driftedResources": random.randint(15, 30),
            "driftPercentage": round(random.uniform(0.5, 1.5), 1),
            "criticalDrifts": random.randint(3, 8),
            "recentDrifts": [
                {"resource": "aws_instance.web-server-1", "type": "instance_type", "expected": "t3.medium", "actual": "t3.large"},
                {"resource": "aws_s3.bucket-data", "type": "versioning", "expected": "Enabled", "actual": "Disabled"},
                {"resource": "aws_security_group.web-sg", "type": "ingress_rules", "expected": "3 rules", "actual": "5 rules"}
            ]
        },
        "compliance": {
            "overallScore": random.randint(85, 98),
            "policies": [
                {"name": "Security Groups", "score": 95, "status": "compliant"},
                {"name": "IAM Policies", "score": 88, "status": "compliant"},
                {"name": "S3 Bucket Security", "score": 96, "status": "compliant"},
                {"name": "VPC Configuration", "score": 89, "status": "compliant"}
            ],
            "violations": [
                {"policy": "Security Groups", "resource": "sg-web-123", "issue": "Open port 22 to 0.0.0.0/0"},
                {"policy": "IAM Policies", "resource": "role-lambda-456", "issue": "Overly permissive policy"}
            ]
        }
    }

@app.get("/")
async def root():
    return {"message": "Terraform Analytics API", "version": "1.0.0"}

@app.get("/api/analytics")
async def get_analytics(timeRange: str = "7d"):
    """
    Get Terraform analytics data
    timeRange: 24h, 7d, 30d, 90d
    """
    try:
        # In a real implementation, you would filter data based on timeRange
        # For now, we'll return the same data structure
        analytics_data = generate_mock_analytics_data()
        return analytics_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/deployments")
async def get_deployment_metrics():
    """Get deployment-specific metrics"""
    try:
        data = generate_mock_analytics_data()
        return data["deployments"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/costs")
async def get_cost_metrics():
    """Get cost-specific metrics"""
    try:
        data = generate_mock_analytics_data()
        return data["costs"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/security")
async def get_security_metrics():
    """Get security-specific metrics"""
    try:
        data = generate_mock_analytics_data()
        return data["security"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/drift")
async def get_drift_analysis():
    """Get drift analysis data"""
    try:
        data = generate_mock_analytics_data()
        return data["driftAnalysis"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/analytics/compliance")
async def get_compliance_data():
    """Get compliance data"""
    try:
        data = generate_mock_analytics_data()
        return data["compliance"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/terraform-plan")
async def run_terraform_plan(project: str):
    """Simulate running a Terraform plan"""
    try:
        # In a real implementation, this would actually run terraform plan
        return {
            "status": "success",
            "message": f"Terraform plan initiated for {project}",
            "plan_id": f"plan-{random.randint(1000, 9999)}",
            "estimated_duration": "2-5 minutes"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics/check-drift")
async def check_drift(project: str):
    """Simulate checking for infrastructure drift"""
    try:
        # In a real implementation, this would actually check for drift
        drift_count = random.randint(0, 10)
        return {
            "status": "success",
            "message": f"Drift check completed for {project}",
            "drift_count": drift_count,
            "critical_drifts": random.randint(0, drift_count),
            "scan_time": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)