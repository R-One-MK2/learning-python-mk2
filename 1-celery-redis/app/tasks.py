import time
from datetime import datetime, timezone

from .db import SessionLocal, Task, TaskStatus
from .logging import log
from .worker import celery_app


@celery_app.task(bind=True)
def long_task(self, x, y):
    # Get the Celery task ID
    task_id = self.request.id

    # Bind task_id to all logs in this context
    log_wc = log.bind(task_id=task_id)

    # Create database session
    db = SessionLocal()

    try:
        # 1. Create task record in database
        # log_wc.info("task_received", x=x, y=y)
        # task = Task(id=task_id, x=x, y=y, status=TaskStatus.PENDING)
        # db.add(task)
        # db.commit()
        # Get existing task (already created in main.py)
        task = db.query(Task).filter(Task.id == task_id).first()

        if not task:
            log_wc.error("task_not_found_in_db", task_id=task_id)
            raise Exception(f"Task {task_id} not found in database")

        # 2. Update status to PROCESSING
        log_wc.info("task_processing")
        task.status = TaskStatus.PROCESSING
        db.commit()

        # 3. Do the work
        log_wc.info("task_started", operation="addition")
        time.sleep(5)
        result = x + y
        log_wc.info("task_completed", result=result)

        # 4. Update status to COMPLETED and save result
        task.status = TaskStatus.COMPLETED
        task.result = result
        task.completed_at = datetime.now(timezone.utc)
        db.commit()

        return result

    except Exception as e:
        # On error, mark as FAILED
        log_wc.error("task_failed", error=str(e), exc_info=True)
        if task:
            task.status = TaskStatus.FAILED
            task.error = str(e)
            db.commit()
        raise

    finally:
        # Always close the database connection
        db.close()
        log_wc.info("task_cleanup_complete")
