import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["setup"])


# Data models
class SetupRequest(BaseModel):
    name: str
    description: str = ""  # Optional
    tags: List[str] = []  # Optional tags
    modelVersion: str
    apiToken: str
    testingEndpointUrl: str
    testRatio: str  # small, medium, large
    judges: List[str]  # Selected judge frameworks
    pillars: List[str]  # Selected evaluation pillars


class SetupResponse(BaseModel):
    status: str
    message: str
    job_id: str


# Job models
class JobStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class SetupConfig(BaseModel):
    """Setup configuration for a job"""

    modelVersion: str
    apiToken: str
    testingEndpointUrl: str
    testRatio: str
    judges: List[str]
    pillars: List[str]
    tags: List[str] = []


class JobResponse(BaseModel):
    id: str
    name: str
    description: str
    status: JobStatus
    createdAt: str
    progress: int
    setup: SetupConfig


# Mock data - Replace with real DB queries later
JOBS = [
    {
        "id": "job_abc12345",
        "name": "Setup Validation",
        "description": "Validating setup configuration",
        "status": "completed",
        "createdAt": "2026-05-18T10:30:00Z",
        "progress": 100,
        "setup": {
            "modelVersion": "gpt-4",
            "apiToken": "sk-abc123***",
            "testingEndpointUrl": "https://api.openai.com/v1",
            "testRatio": "medium",
            "judges": ["laaj", "moonshot"],
            "pillars": ["Transparency", "Safety", "Fairness"],
            "tags": ["production", "q4-testing"],
        },
    },
    {
        "id": "job_def67890",
        "name": "Data Processing",
        "description": "Processing evaluation data",
        "status": "processing",
        "createdAt": "2026-05-18T11:00:00Z",
        "progress": 45,
        "setup": {
            "modelVersion": "gpt-3.5-turbo",
            "apiToken": "sk-def456***",
            "testingEndpointUrl": "https://api.openai.com/v1",
            "testRatio": "small",
            "judges": ["aidx"],
            "pillars": ["Robustness", "Security"],
            "tags": ["testing"],
        },
    },
    {
        "id": "job_ghi11111",
        "name": "Initial Setup",
        "description": "First setup attempt",
        "status": "failed",
        "createdAt": "2026-05-18T09:00:00Z",
        "progress": 0,
        "setup": {
            "modelVersion": "claude-3",
            "apiToken": "sk-ghi789***",
            "testingEndpointUrl": "https://api.anthropic.com/v1",
            "testRatio": "large",
            "judges": ["laaj", "moonshot", "aidx"],
            "pillars": ["Transparency", "Explainability", "Safety", "Fairness"],
            "tags": [],
        },
    },
    {
        "id": "job_jkl22222",
        "name": "Model Evaluation",
        "description": "Evaluating model performance",
        "status": "pending",
        "createdAt": "2026-05-18T11:30:00Z",
        "progress": 0,
        "setup": {
            "modelVersion": "gpt-4-turbo",
            "apiToken": "sk-jkl012***",
            "testingEndpointUrl": "https://api.openai.com/v1",
            "testRatio": "medium",
            "judges": ["moonshot"],
            "pillars": ["Accountability", "Human Agency & Oversight"],
            "tags": ["high-priority"],
        },
    },
]


# Endpoints
@router.post("/setup", response_model=SetupResponse)
async def create_setup(data: SetupRequest):
    """
    Receive setup configuration from frontend

    Later: Save to DB and publish to Redis queue
    """

    # Generate unique job ID
    job_id = f"job_{uuid.uuid4().hex[:8]}"

    print("📥 Received setup:")
    print(f"   Name: {data.name}")
    print(f"   Description: {data.description}")
    print(f"   Tags: {data.tags}")
    print(f"   Model Version: {data.modelVersion}")
    print(f"   API Token: {data.apiToken}")
    print(f"   Testing Endpoint URL: {data.testingEndpointUrl}")
    print(f"   Test Ratio: {data.testRatio}")
    print(f"   Judges: {data.judges}")
    print(f"   Pillars: {data.pillars}")

    # Create new job with setup details
    new_job = {
        "id": job_id,
        "name": data.name,
        "description": data.description,
        "status": "pending",
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "progress": 0,
        "setup": {
            "modelVersion": data.modelVersion,
            "apiToken": data.apiToken,
            "testingEndpointUrl": data.testingEndpointUrl,
            "testRatio": data.testRatio,
            "judges": data.judges,
            "pillars": data.pillars,
            "tags": data.tags,
        },
    }

    # Add to jobs list
    JOBS.append(new_job)

    return SetupResponse(
        status="ok",
        message=f"Setup '{data.name}' received!",
        job_id=job_id,  # ← NEW: Return the job ID
    )


@router.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy"}


# Jobs endpoints
@router.get("/jobs", response_model=List[JobResponse])
async def get_jobs(status: Optional[str] = Query(None)):
    """
    Get all jobs, optionally filtered by status

    Query params:
    - status: Filter by job status (pending, processing, completed, failed)
    """
    jobs = JOBS
    if status:
        jobs = [j for j in jobs if j["status"] == status]
    return jobs


@router.get("/jobs/completed", response_model=List[JobResponse])
async def get_completed_jobs():
    """Get completed and failed jobs (for history view)"""
    return [j for j in JOBS if j["status"] in ["completed", "failed"]]


@router.get("/jobs/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    """Get a specific job by ID"""
    for job in JOBS:
        if job["id"] == job_id:
            return job
    return {"error": "Job not found"}
