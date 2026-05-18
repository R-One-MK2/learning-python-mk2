from api.routes import router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI
app = FastAPI(
    title="FS API Evaluator",
    description="Evaluate File System APIs with Celery",
    version="0.1.0",
)

# CORS middleware - allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router)


# Root endpoint
@app.get("/")
async def root():
    return {"message": "FS API Evaluator", "docs": "http://localhost:8000/docs"}


if __name__ == "__main__":
    import uvicorn

    print("🚀 Starting FastAPI server...")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🏥 Health: http://localhost:8000/health")

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Auto-reload on code changes
    )
