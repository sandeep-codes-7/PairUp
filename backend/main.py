import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from api.routes import router
from core.matchmaker import match_users_task

# Lifespan context manager to handle background tasks natively
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create the background task
    task = asyncio.create_task(match_users_task())
    yield
    # Shutdown: Cancel the task
    task.cancel()

app = FastAPI(lifespan=lifespan)

# Include our API routes
app.include_router(router)

# Mount static files
app.mount("/css", StaticFiles(directory="static/css"), name="css")
app.mount("/js", StaticFiles(directory="static/js"), name="js")

# Serve the index page
@app.get("/")
async def get_index():
    return FileResponse("static/index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)