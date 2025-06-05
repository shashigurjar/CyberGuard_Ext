from mongoengine import Document, StringField, FloatField

class UrlPrediction(Document):
    url = StringField(required = True)
    status = StringField(required = True, choices = ['success', 'erroe'])
    prediction = StringField(required = True, choices=['phishin', 'legitimate', 'error'])
    phishy_prediction = FloatField(min_value=0.0, max_value=1.0)

    def __str__(self):
        return f"UrlPrediction(url={self.url}, prediction={self.prediction}, probability={self.phishy_probability})"

    