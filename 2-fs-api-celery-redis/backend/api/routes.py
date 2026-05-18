import uuid

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["setup"])


# Data models
class SetupRequest(BaseModel):
    name: str
    description: str = ""  # Optional
    modelVersion: str
    apiToken: str
    testingEndpointUrl: str


class SetupResponse(BaseModel):
    status: str
    message: str
    job_id: str


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
    print(f"   Model Version: {data.modelVersion}")
    print(f"   API Token: {data.apiToken}")
    print(f"   Testing Endpoint URL: {data.testingEndpointUrl}")

    # For now, just echo back
    return SetupResponse(
        status="ok",
        message=f"Setup '{data.name}' received!",
        job_id=job_id,  # ← NEW: Return the job ID
    )


@router.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy"}
