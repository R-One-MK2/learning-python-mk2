from fastapi import FastAPI

app = FastAPI(title="Backend Web API")


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": "1.0.0"}
