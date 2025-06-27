from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List

from app.ml.url_model import predict_url

router = APIRouter()

class URLRequest(BaseModel):
    urls: List[str]


class PredictionResult(BaseModel):
    status: str
    prediction: str
    confidence: float


class URLResponse(BaseModel):
    results: Dict[str, PredictionResult]


@router.post("/predict-url", response_model=URLResponse)
def predict_phishy_urls(data: URLRequest):
    results: Dict[str, PredictionResult] = {}

    for url in data.urls:
        try:
            result = predict_url(url)
            results[url] = PredictionResult(
                status="success",
                prediction=result["label"],
                confidence=result["confidence"]
            )

        except Exception as e:
            results[url] = PredictionResult(
                status="error",
                prediction=str(e),
                confidence=-1.0
            )

    return {"results": results}
