import time

from .worker import celery_app


@celery_app.task(bind=True)
def long_task(self, x, y):
    print(f"Running: {x} + {y}")
    time.sleep(5)
    result = x + y
    print(f"Finished: {result}")
    return result
