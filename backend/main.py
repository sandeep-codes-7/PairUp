import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:9090", "http://127.0.0.1:9090", "http://0.0.0.0:9090"], # Vite's default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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