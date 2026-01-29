import pandas as pd
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import numpy as np

# Load dataset
data = pd.read_csv("dataset/DiseaseAndSymptoms.csv")

# Get symptom columns
symptom_cols = [c for c in data.columns if "Symptom" in c]

# Combine symptoms into list
data["symptoms"] = data[symptom_cols].values.tolist()

# Remove NaN and clean symptoms (normalize underscores and spaces)
def clean_symptom(s):
    s = str(s).strip().lower()
    s = s.replace(" ", "_").replace("__", "_")
    return s if s != "nan" and s != "" else None

data["symptoms"] = data["symptoms"].apply(lambda x: [clean_symptom(s) for s in x if clean_symptom(s)])

# Clean disease names (remove extra spaces)
data["Disease"] = data["Disease"].str.strip()

# Convert to binary features
mlb = MultiLabelBinarizer()
X = mlb.fit_transform(data["symptoms"])
y = data["Disease"]

print("=" * 50)
print("TRAINING IMPROVED MODEL")
print("=" * 50)
print(f"Total samples: {len(data)}")
print(f"Total unique symptoms: {len(mlb.classes_)}")
print(f"Total unique diseases: {len(y.unique())}")
print()

# Split for accuracy testing with stratification
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Train model with balanced class weights for better multi-class prediction
model = RandomForestClassifier(
    n_estimators=500,           # More trees for better accuracy
    max_depth=20,               # Prevent overfitting
    min_samples_split=3,        # Better generalization
    min_samples_leaf=2,         # Prevent overfitting
    class_weight='balanced',    # Handle class imbalance - KEY FIX!
    random_state=42,
    n_jobs=-1                   # Use all CPU cores
)

model.fit(X_train, y_train)

# Check accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Test Accuracy: {accuracy * 100:.2f}%")
print()

# Create disease-symptom mapping for reference in API
disease_symptom_map = {}
for idx, row in data.iterrows():
    disease = row["Disease"]
    symptoms = row["symptoms"]
    if disease not in disease_symptom_map:
        disease_symptom_map[disease] = set()
    disease_symptom_map[disease].update(symptoms)

# Convert sets to lists for saving
disease_symptom_map = {k: list(v) for k, v in disease_symptom_map.items()}

# Retrain on full data for production
print("Retraining on full dataset for production...")
model.fit(X, y)

# SAVE FILES
joblib.dump(model, "big_model.pkl")
joblib.dump(mlb, "symptom_encoder.pkl")
joblib.dump(disease_symptom_map, "disease_symptom_map.pkl")

print()
print("=" * 50)
print("✅ big_model.pkl saved")
print("✅ symptom_encoder.pkl saved")
print("✅ disease_symptom_map.pkl saved")
print("=" * 50)

# Show sample disease-symptom mappings
print("\nSample disease-symptom mappings:")
for disease in list(disease_symptom_map.keys())[:5]:
    symptoms = disease_symptom_map[disease][:5]
    print(f"  {disease}: {', '.join(symptoms)}")
