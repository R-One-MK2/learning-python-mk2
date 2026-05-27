from app.domain.auth.services import AuthService
from app.logging_config import logger
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
    # inside signup handler, after payload validated
    logger.info("signup_attempt", email=payload.email, endpoint="/auth/signup")

    auth_service = AuthService()

    registered_user = await auth_service.register_new_user(
        email=payload.email, password=payload.password
    )
    # on success
    logger.info(
        "signup_success", email=registered_user["email"], user_id=registered_user["id"]
    )
    return registered_user
