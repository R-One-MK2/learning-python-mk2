FROM python:3.13-slim

# Install uv
RUN pip install uv

# Set working directory
WORKDIR /app

# Copy project files (excluding .venv, __pycache__, etc via .dockerignore)
COPY . .

# Install dependencies using uv to system Python
RUN uv pip install --system -e .

# Default command (will be overridden by docker-compose)
CMD ["python"]