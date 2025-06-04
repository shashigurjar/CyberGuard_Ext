from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.url_prediction import router as url_router

app = FastAPI(title="Phishing Detection Server")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(url_router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Phishing Detection Server is up. POST to /api/predict-url"}
