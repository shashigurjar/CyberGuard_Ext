from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.url_prediction_routes import router as url_router
from app.routes.image_prediction_routes import router as image_router

app = FastAPI(title="Phishing Detection Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(url_router, prefix="/api")
app.include_router(image_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Phishing Detection Server is up. POST to /api"}
