import os
import pandas as pd
import joblib
from threading import Lock
from .preprocess_url import extract_url_features

BASE_DIR = os.path.abspath("C:/Users/Asus/Downloads")
MODEL_PATH = os.path.join(BASE_DIR, "phishing_detection_pipeline (1).pkl")
FEATURE_NAMES_PATH = os.path.join(BASE_DIR, "feature_names.pkl")

_model = None
_feature_names = None
_load_lock = Lock()

def _load_feature_names():
    global _feature_names
    if _feature_names is None:
        try:
            _feature_names = joblib.load(FEATURE_NAMES_PATH)
        except Exception as e:
            raise RuntimeError(f"Could not load feature names at '{FEATURE_NAMES_PATH}': {e}")
    return _feature_names

def get_model():
    """
    Lazily load the model pipeline. First attempt mmap_mode='r', 
    and if that fails, fall back to default load.
    """
    global _model
    if _model is not None:
        return _model

    with _load_lock:
        if _model is None:
            _ = _load_feature_names()

            # Load the pipeline
            try:
                _model = joblib.load(MODEL_PATH, mmap_mode="r")
            except MemoryError:
                _model = joblib.load(MODEL_PATH)
            except Exception as e:
                raise RuntimeError(f"Could not load model at '{MODEL_PATH}': {e}")

    return _model

def predict_url(url: str) -> dict:

    # 1. Lazy-load model & feature_names
    model = get_model()
    feature_names = _load_feature_names()

    # 2. Extract raw features
    features = extract_url_features(url)

    # 3. Keep only those keys in feature_names (missing keys → 0)
    filtered = {k: features.get(k, 0) for k in feature_names}
    input_df = pd.DataFrame([filtered], columns=feature_names)

    # 4. Model prediction
    pred_label = model.predict(input_df)[0]

    confidence = 1.0
    if hasattr(model, "predict_proba"):
        try:
            probs = model.predict_proba(input_df)[0]
            idx = int(pred_label)
            confidence = float(probs[idx])
        except Exception:
            confidence = 1.0

    # 6. Map numeric label to string
    label_str = "Phishing" if int(pred_label) == 1 else "Legitimate"

    return {"label": label_str, "confidence": confidence}


if __name__ == "__main__":
    test_url = "xini.eu/00Qe"
    result = predict_url(test_url)
    print(f"Test URL: {test_url} → {result}")
