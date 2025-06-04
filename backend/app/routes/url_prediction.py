from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ml.url_model import predict_url

router = APIRouter()

class URLRequest(BaseModel):
    url: str

class URLResponse(BaseModel):
    prediction: str
    confidence: float

@router.post("/predict-url", response_model=URLResponse)
def predict_phishy_url(data: URLRequest):
    try:
        result = predict_url(data.url)
        return URLResponse(prediction=result["label"], confidence=result["confidence"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
