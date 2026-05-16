from app.tasks import long_task

if __name__ == "__main__":
    task = long_task.delay(10, 20)
    print("Task submitted!")
    print(f"Task ID: {task.id}")
