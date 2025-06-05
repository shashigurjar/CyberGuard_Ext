from mongoengine import Document, StringField, FloatField

class ImagePrediction(Document):
    url = StringField(required=True)
    status = StringField(required=True, choices=['success', 'error'])
    prediction = StringField(choices=['phishing', 'legitimate', 'error'])
    phishy_probability = FloatField(min_value=0.0, max_value=1.0)

    def __str__(self):
        return f"ImagePrediction(url={self.url}, prediction={self.prediction}, probability={self.phishy_probability})"
