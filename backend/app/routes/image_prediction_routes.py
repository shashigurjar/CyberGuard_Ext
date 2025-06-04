from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.ml.image_model import predict_image

router = APIRouter()

class URLRequest(BaseModel):
    image_url: str

class URLResponse(BaseModel):
    prediction: str
    phishy_probability: float
    
@router.post("/predict-image", response_model=URLResponse)
def predict_phishy_url(data: URLRequest):
    try:
        result = predict_image(data.image_url)
        return URLResponse(prediction=result["label"], phishy_probability=result["phishy_probability"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))