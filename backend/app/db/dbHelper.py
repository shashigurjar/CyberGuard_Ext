from app.schemas.user_schema import User
from app.schemas.urlPrediction_schema import UrlPrediction
from app.schemas.imagePrediction_schema import ImagePrediction


def save_url_prediction(url, status, prediction, probability):
    result = UrlPrediction(
        url=url,
        status=status,
        prediction=prediction,
        phishy_probability=probability
    )
    result.save()
    print("URL predictions saved to database")

def save_image_prediction(url, status, prediction, probability):
    result = ImagePrediction(
        url=url,
        status=status,
        prediction=prediction,
        phishy_probability=probability
    )
    result.save()
    print("Image predictions saved to database")

def get_all_url_predictions():
    return UrlPrediction.objects()
