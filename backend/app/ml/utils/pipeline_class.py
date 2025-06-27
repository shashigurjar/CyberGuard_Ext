from tensorflow.keras.models import model_from_json


class QRHybridPipeline:
    def __init__(self, model_json, model_weights, preprocessor, kbest, training_columns):
        # Keras pieces (JSON + weights)
        self._model_json    = model_json
        self._model_weights = model_weights

        # Scikit-learn transformers
        self.preprocessor     = preprocessor
        self.kbest            = kbest

        # Metadata
        self.training_columns = training_columns

        # Placeholder for reconstructed model
        self.model = None

    def load_model(self):
        """Rebuilds and compiles the Keras model from JSON + weights."""
        if self.model is None:
            self.model = model_from_json(self._model_json)
            self.model.set_weights(self._model_weights)
            self.model.compile(
                optimizer="adam",
                loss="binary_crossentropy",
                metrics=["accuracy"]
            )
        return self.model