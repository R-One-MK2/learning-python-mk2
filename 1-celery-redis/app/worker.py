import os

from celery import Celery

# Get Redis URL from environment or use default
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery("worker", broker=redis_url, backend=redis_url)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# # Import tasks to register them with the Celery app
# from . import tasks  # noqa: E402, F401

# Automatically discover and load tasks from the app module
celery_app.autodiscover_tasks(["app"])
