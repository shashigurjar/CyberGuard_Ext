<<<<<<< HEAD
from schemas.user_schema import User
from schemas.urlPrediction_schema import UrlPrediction
from schemas.imagePrediction_schema import ImagePrediction


def save_user(name, email, password):
    user = User(name=name, email=email, password=password)
    user.save()
    return user

=======
from app.schemas.user_schema import User
from app.schemas.urlPrediction_schema import UrlPrediction
from app.schemas.imagePrediction_schema import ImagePrediction


>>>>>>> friend/main
def save_url_prediction(url, status, prediction, probability):
    result = UrlPrediction(
        url=url,
        status=status,
        prediction=prediction,
        phishy_probability=probability
    )
    result.save()
<<<<<<< HEAD
    return result
=======
    print("URL predictions saved to database")
>>>>>>> friend/main

def save_image_prediction(url, status, prediction, probability):
    result = ImagePrediction(
        url=url,
        status=status,
        prediction=prediction,
        phishy_probability=probability
    )
    result.save()
<<<<<<< HEAD
    return result
=======
    print("Image predictions saved to database")
>>>>>>> friend/main

def get_all_url_predictions():
    return UrlPrediction.objects()
