from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List

from app.ml.image_model import predict_image

router = APIRouter()

class URLRequest(BaseModel):
    urls: List[str]

class PredictionResult(BaseModel):
    status: str
    prediction: str
    phishy_probability: float

class URLResponse(BaseModel):
    results: Dict[str, PredictionResult]
    
@router.post("/predict-image", response_model=URLResponse)
def predict_phishy_image(data: URLRequest):
    results = {}
    for url in data.urls:
        result = predict_image(url)
        if "error" in result:
            results[url] = PredictionResult(
                status="error",
                prediction=result["error"],
                phishy_probability=-1.0
            )
        else:
            results[url] = PredictionResult(
                status="success",
                prediction=result["label"],
                phishy_probability=result["phishy_probability"]
            )
    return {"results": results}
