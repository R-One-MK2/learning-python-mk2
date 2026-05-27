from app.logging_config import logger


class AuthService:
    def __init__(self) -> None:
        self.logger = logger.bind(service="auth_service")

    async def register_new_user(self, email: str, password: str) -> dict:
        self.logger.info("attempting_user_registration", email=email)

        mock_identity = {"id": 777, "email": email, "is_active": True}

        self.logger.info(
            "user_registration_success", email=email, user_id=mock_identity.get("id")
        )
        return mock_identity
