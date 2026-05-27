import structlog
from app.api.v1.auth import router as auth_router
from app.logging_config import setup_logging
from fastapi import FastAPI

# Initialise structured logging
setup_logging()
logger = structlog.get_logger()

app = FastAPI(title="Backend Web API", description="Vertical T architecture learning")


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}


app.include_router(auth_router, prefix="/api/v1")


@app.get("/")
def check_engine_health():
    return {"status": "Edge shell routes operating clean."}
