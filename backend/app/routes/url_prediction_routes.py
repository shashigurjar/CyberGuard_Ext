from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, List

from app.ml.url_model import predict_url
from app.db.dbHelper import UrlPrediction

router = APIRouter()

class URLRequest(BaseModel):
    urls: List[str]


class PredictionResult(BaseModel):
    status: str
    prediction: str
    phishy_probability: float


class URLResponse(BaseModel):
    results: Dict[str, PredictionResult]


@router.post("/predict-url", response_model=URLResponse)
def predict_phishy_urls(data: URLRequest):
    results: Dict[str, PredictionResult] = {}
    predictions_to_save = []
    for url in data.urls:
        try:
            result = predict_url(url)
            pred = PredictionResult(
                status="success",
                prediction=result["label"],
                phishy_probability=result["phishy_probability"]
            )

        except Exception as e:
            pred = PredictionResult(
                status="error",
                prediction=str(e),
                phishy_probability=-1.0
            )
        results[url] = pred
        predictions_to_save.append(
            UrlPrediction(
                url=url,
                status=pred.status,
                prediction=pred.prediction,
                phishy_probability=pred.phishy_probability
            )
        )
    # Bulk insert into the database
    if predictions_to_save:
        UrlPrediction.objects.insert(predictions_to_save)
        print("URL predictions saved to database")
    return {"results": results}
