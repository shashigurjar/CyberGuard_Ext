import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import joblib
from preprocess_url import extract_url_features


base_path = os.path.abspath("C:/Users/Asus/Downloads")

model_path = os.path.join(base_path, "phishing_detection_pipeline (1).pkl")
feature_names_path = os.path.join(base_path, "feature_names.pkl")

model = joblib.load(model_path)
feature_names = joblib.load(feature_names_path)



def predict_phishing(url):
    features = extract_url_features(url)

    filtered_features = {key: features.get(key, 0) for key in feature_names}

    input_df = pd.DataFrame([filtered_features], columns=feature_names)

    prediction = model.predict(input_df)[0]
    return "Phishing" if prediction == 1 else "Legitimate"



# --- Example ---
result = predict_phishing("xini.eu/00Qe")
print(result)

