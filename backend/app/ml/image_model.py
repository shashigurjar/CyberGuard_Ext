import requests
import cv2
import numpy as np
import pandas as pd
import pickle
import os
import joblib

from pyzbar import pyzbar

from utils.utils import cast_to_int
from utils.pipeline_class import QRHybridPipeline
from preprocess_url import extract_clean_url, extract_url_features


with open(os.path.abspath("app/ml/trainedModels/qr_hybrid_pipeline.pkl"), "rb") as f:
    loaded_pipeline = pickle.load(f)

model = loaded_pipeline.load_model()

preprocessor = loaded_pipeline.preprocessor
kbest = loaded_pipeline.kbest
training_columns = loaded_pipeline.training_columns


def preprocess_image_array(img, img_size=(128, 128)):
    img = cv2.resize(img, img_size)
    img = img.astype("float32") / 255.0
    img = np.expand_dims(img, axis=-1)   # (H, W, 1)
    img = np.expand_dims(img, axis=0)    # (1, H, W, 1)
    return img

def predict_qr_from_url(image_url,
                        model,
                        preprocessor,
                        kbest,
                        training_columns):

    # 1) Download image
    resp = requests.get(image_url)
    if resp.status_code != 200:
        raise ValueError(f"Failed to download image: HTTP {resp.status_code}")
    img_array = np.asarray(bytearray(resp.content), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Downloaded content is not a valid image")

    # 2) Decode QR codes
    decoded_objs = pyzbar.decode(img)
    if not decoded_objs:
        return {"error": "No QR code detected in image"}

    # 3) Extract QR content and URL features
    qr_content = decoded_objs[0].data.decode("utf-8")
    cleaned_url = extract_clean_url(qr_content)
    if not cleaned_url:
        return {"error": "Decoded QR has no valid URL"}
    url_features = extract_url_features(cleaned_url)

    # 4) Prepare model inputs
    X_img = preprocess_image_array(img)
    X_url_df = pd.DataFrame([url_features], columns=training_columns)
    X_url_pre = preprocessor.transform(X_url_df)
    X_url_fin = kbest.transform(X_url_pre)

    # 5) Predict
    pred_prob = model.predict({
        "qr_image": X_img,
        "url_features": X_url_fin
    })[0][0]

    return {
        "malicious_probability": float(pred_prob),
        "prediction": "Malicious" if pred_prob >= 0.5 else "Benign"
    }

# Example usage:
result = predict_qr_from_url(
    "https://docs.lightburnsoftware.com/legacy/img/QRCode/ExampleCode.png",
    model,
    preprocessor,
    kbest,
    training_columns
)
print(result)
