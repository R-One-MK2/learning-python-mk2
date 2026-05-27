from fastapi import APIRouter, status
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/auth", tags=["Authentication"])


class UserSignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Plain text credential string")


class UserResponseEnvelope(BaseModel):
    id: int
    email: EmailStr
    is_active: bool


@router.post(
    "/signup",
    response_model=UserResponseEnvelope,
    status_code=status.HTTP_201_CREATED,
    summary="UC-01A: Register New Local User Credentials",
)
async def signup(payload: UserSignupRequest) -> dict:
    mock_aggregate = {
        "id": 999,
        "email": payload.email,
        "is_active": True,
    }

    return mock_aggregate
