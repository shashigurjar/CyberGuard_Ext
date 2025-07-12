from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List

from app.ml.image_model import predict_image
from app.db.dbHelper import ImagePrediction

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
    predictions_to_save = []
    for url in data.urls:
        result = predict_image(url)
        if "error" in result:
            pred = PredictionResult(
                status="error",
                prediction=result["error"],
                phishy_probability=-1.0
            )
        else:
            pred = PredictionResult(
                status="success",
                prediction=result["label"],
                phishy_probability=result["phishy_probability"]
            )
        results[url] = pred
        predictions_to_save.append(
            ImagePrediction(
                url=url,
                status=pred.status,
                prediction=pred.prediction,
                phishy_probability=pred.phishy_probability
            )
        )
    # Bulk insert into the database
    if predictions_to_save:
        ImagePrediction.objects.insert(predictions_to_save)
        print("Image predictions saved to database")
    return {"results": results}
