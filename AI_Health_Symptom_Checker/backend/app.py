from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import numpy as np
import json
import os
from datetime import datetime
import hashlib

app = Flask(__name__)
CORS(app)

# Database file paths
USERS_DB = "users.json"
HISTORY_DB = "history.json"

# Initialize database files
def init_db():
    if not os.path.exists(USERS_DB):
        with open(USERS_DB, 'w') as f:
            json.dump({}, f)
    if not os.path.exists(HISTORY_DB):
        with open(HISTORY_DB, 'w') as f:
            json.dump({}, f)

init_db()

def load_users():
    with open(USERS_DB, 'r') as f:
        return json.load(f)

def save_users(users):
    with open(USERS_DB, 'w') as f:
        json.dump(users, f, indent=2)

def load_history():
    with open(HISTORY_DB, 'r') as f:
        return json.load(f)

def save_history(history):
    with open(HISTORY_DB, 'w') as f:
        json.dump(history, f, indent=2)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Load BIG model and encoder
big_model = joblib.load("big_model.pkl")
symptom_encoder = joblib.load("symptom_encoder.pkl")

# Load disease-symptom mapping for smarter predictions
try:
    disease_symptom_map = joblib.load("disease_symptom_map.pkl")
except:
    disease_symptom_map = {}

# Dangerous diseases list for urgency
dangerous_diseases = ["Paralysis (brain hemorrhage)", "Heart attack", "Stroke", "Pneumonia", "Tuberculosis", "Hepatitis B", "Hepatitis C", "AIDS", "Malaria", "Dengue", "Typhoid"]

# Symptom severity scores (1-10 scale, 10 being most severe)
symptom_severity = {
    # Critical symptoms (9-10)
    "chest_pain": 10,
    "breathlessness": 9,
    "continuous_sneezing": 9,
    "paralysis": 10,
    "coma": 10,
    "heart_attack": 10,
    
    # High severity (7-8)
    "high_fever": 8,
    "vomiting": 7,
    "bleeding": 8,
    "seizures": 9,
    "dizziness": 7,
    "loss_of_balance": 8,
    "altered_sensorium": 8,
    "blurred_and_distorted_vision": 7,
    
    # Medium severity (4-6)
    "headache": 6,
    "stomach_pain": 5,
    "abdominal_pain": 6,
    "nausea": 5,
    "fatigue": 5,
    "weakness": 5,
    "chills": 5,
    "sweating": 4,
    "cough": 5,
    "throat_irritation": 4,
    "skin_rash": 5,
    
    # Low severity (1-3)
    "itching": 3,
    "mild_fever": 3,
    "loss_of_appetite": 3,
    "restlessness": 3,
    "cold": 2,
    "sneezing": 2,
    "runny_nose": 2,
}

# Minimum confidence threshold for showing predictions
CONFIDENCE_THRESHOLD = 35

# Rule-based medical filters (immediate medical attention needed if these symptoms present)
critical_symptom_patterns = {
    "chest_pain": ["Heart attack", "Angina", "Myocardial infarction"],
    "breathlessness": ["Asthma", "Pneumonia", "Heart attack"],
    "paralysis": ["Stroke", "Paralysis (brain hemorrhage)"],
    "seizures": ["Epilepsy"],
    "continuous_sneezing": ["Allergic rhinitis", "Common cold"],
}

# Doctor recommendation mapping (Disease -> Specialist type)
disease_to_specialist = {
    # Cardiovascular
    "Heart attack": "Cardiologist",
    "Hypertension": "Cardiologist",
    "Varicose veins": "Vascular Surgeon",
    
    # Neurological
    "Paralysis (brain hemorrhage)": "Neurologist",
    "Stroke": "Neurologist",
    "Migraine": "Neurologist",
    "Cervical spondylosis": "Neurologist/Orthopedic",
    
    # Respiratory
    "Pneumonia": "Pulmonologist",
    "Bronchial Asthma": "Pulmonologist",
    "Tuberculosis": "Pulmonologist",
    "Common Cold": "General Physician",
    
    # Gastroenterology
    "Peptic ulcer diseae": "Gastroenterologist",
    "GERD": "Gastroenterologist",
    "Chronic cholestasis": "Gastroenterologist",
    "Hepatitis A": "Gastroenterologist/Hepatologist",
    "Hepatitis B": "Gastroenterologist/Hepatologist",
    "Hepatitis C": "Gastroenterologist/Hepatologist",
    "Hepatitis D": "Gastroenterologist/Hepatologist",
    "Hepatitis E": "Gastroenterologist/Hepatologist",
    "Alcoholic hepatitis": "Gastroenterologist/Hepatologist",
    "Jaundice": "Gastroenterologist",
    
    # Infectious Diseases
    "Malaria": "Infectious Disease Specialist",
    "Dengue": "Infectious Disease Specialist",
    "Typhoid": "Infectious Disease Specialist",
    "AIDS": "Infectious Disease Specialist",
    "Chicken pox": "General Physician",
    
    # Endocrinology
    "Diabetes": "Endocrinologist",
    "Hyperthyroidism": "Endocrinologist",
    "Hypothyroidism": "Endocrinologist",
    "Hypoglycemia": "Endocrinologist",
    
    # Dermatology
    "Psoriasis": "Dermatologist",
    "Fungal infection": "Dermatologist",
    "Acne": "Dermatologist",
    "Impetigo": "Dermatologist",
    
    # Rheumatology
    "Arthritis": "Rheumatologist",
    "Osteoarthristis": "Rheumatologist/Orthopedic",
    
    # Urology/Nephrology
    "Urinary tract infection": "Urologist",
    "Drug Reaction": "Allergist/Immunologist",
    "Allergy": "Allergist/Immunologist",
}

def get_doctor_recommendations(diseases):
    """Get specialist recommendations for given diseases"""
    recommendations = []
    seen_specialists = set()
    
    for disease in diseases:
        specialist = disease_to_specialist.get(disease, "General Physician")
        if specialist not in seen_specialists:
            recommendations.append({
                "specialist": specialist,
                "disease": disease
            })
            seen_specialists.add(specialist)
    
    return recommendations

# Comprehensive symptom aliases for natural language matching
symptom_aliases = {
    # Stomach related
    "stomach pain": "stomach_pain",
    "stomach ache": "stomach_pain",
    "belly pain": "stomach_pain", 
    "tummy ache": "stomach_pain",
    "abdominal pain": "abdominal_pain",
    "belly ache": "abdominal_pain",
    "pain in stomach": "stomach_pain",
    "stomach cramps": "stomach_pain",
    "stomach hurts": "stomach_pain",
    
    # Vomiting/Nausea
    "throwing up": "vomiting",
    "vomit": "vomiting",
    "puking": "vomiting",
    "feeling sick": "nausea",
    "nauseous": "nausea",
    "feel like vomiting": "nausea",
    "want to vomit": "nausea",
    
    # Head related
    "head ache": "headache",
    "head pain": "headache",
    "migraine": "headache",
    "head hurts": "headache",
    "pain in head": "headache",
    
    # Fever related
    "high temperature": "high_fever",
    "temperature": "high_fever",
    "fever": "high_fever",
    "low grade fever": "mild_fever",
    "slight fever": "mild_fever",
    "mild temperature": "mild_fever",
    
    # Cold/Flu related
    "cold": "chills",
    "shivering": "shivering",
    "runny nose": "runny_nose",
    "running nose": "runny_nose",
    "blocked nose": "congestion",
    "stuffy nose": "congestion",
    "nose blocked": "congestion",
    "sneezing": "continuous_sneezing",
    "keep sneezing": "continuous_sneezing",
    "watery eyes": "watering_from_eyes",
    "eyes watering": "watering_from_eyes",
    
    # Digestive
    "loose motion": "diarrhoea",
    "loose stool": "diarrhoea",
    "diarrhea": "diarrhoea",
    "watery stool": "diarrhoea",
    "indigestion": "indigestion",
    "gas": "passage_of_gases",
    "bloating": "distention_of_abdomen",
    "constipation": "constipation",
    "constipated": "constipation",
    "acidity": "acidity",
    "acid reflux": "acidity",
    "burning stomach": "acidity",
    "heartburn": "acidity",
    "ulcer": "ulcers_on_tongue",
    "mouth ulcer": "ulcers_on_tongue",
    
    # Fatigue/Weakness
    "tired": "fatigue",
    "tiredness": "fatigue",
    "exhausted": "fatigue",
    "no energy": "fatigue",
    "weakness": "malaise",
    "weak": "malaise",
    "feeling weak": "malaise",
    "body weak": "muscle_weakness",
    "lethargy": "lethargy",
    "sluggish": "lethargy",
    
    # Pain related
    "body ache": "muscle_pain",
    "body pain": "muscle_pain",
    "muscle pain": "muscle_pain",
    "joint pain": "joint_pain",
    "joints hurt": "joint_pain",
    "knee pain": "knee_pain",
    "back pain": "back_pain",
    "backache": "back_pain",
    "neck pain": "neck_pain",
    "stiff neck": "stiff_neck",
    "chest pain": "chest_pain",
    "chest hurts": "chest_pain",
    
    # Respiratory
    "breathing problem": "breathlessness",
    "difficulty breathing": "breathlessness",
    "short of breath": "breathlessness",
    "cant breathe": "breathlessness",
    "cough": "cough",
    "coughing": "cough",
    "dry cough": "cough",
    "phlegm": "phlegm",
    "mucus": "phlegm",
    
    # Skin related
    "skin rash": "skin_rash",
    "rashes": "skin_rash",
    "rash": "skin_rash",
    "itchy": "itching",
    "itch": "itching",
    "itching all over": "itching",
    "pimples": "pus_filled_pimples",
    "acne": "blackheads",
    "skin peeling": "skin_peeling",
    "red spots": "red_spots_over_body",
    
    # Weight/Appetite
    "weight loss": "weight_loss",
    "losing weight": "weight_loss",
    "lost weight": "weight_loss",
    "weight gain": "weight_gain",
    "no appetite": "loss_of_appetite",
    "not hungry": "loss_of_appetite",
    "dont want to eat": "loss_of_appetite",
    "always hungry": "excessive_hunger",
    "increased appetite": "increased_appetite",
    
    # Other common
    "sweating": "sweating",
    "sweat": "sweating",
    "night sweats": "sweating",
    "dizzy": "dizziness",
    "dizziness": "dizziness",
    "vertigo": "dizziness",
    "sore throat": "throat_irritation",
    "throat pain": "throat_irritation",
    "throat hurts": "throat_irritation",
    "swollen throat": "throat_irritation",
    "anxiety": "anxiety",
    "anxious": "anxiety",
    "worried": "anxiety",
    "depression": "depression",
    "depressed": "depression",
    "sad": "depression",
    "restless": "restlessness",
    "cant sleep": "restlessness",
    "irritable": "irritability",
    "mood swings": "mood_swings",
    "blurred vision": "blurred_and_distorted_vision",
    "vision problem": "blurred_and_distorted_vision",
    "cant see clearly": "blurred_and_distorted_vision",
    "yellow skin": "yellowish_skin",
    "jaundice": "yellowish_skin",
    "yellow eyes": "yellowing_of_eyes",
    "dark urine": "dark_urine",
    "yellow urine": "yellow_urine",
    "burning urination": "burning_micturition",
    "pain while urinating": "burning_micturition",
    "frequent urination": "polyuria",
    "urinating a lot": "polyuria",
    "blood sugar": "irregular_sugar_level",
    "sugar level": "irregular_sugar_level",
    "dehydrated": "dehydration",
    "dehydration": "dehydration",
    "thirsty": "dehydration",
    "swelling": "swelling_joints",
    "swollen": "swelling_joints",
    "heart racing": "fast_heart_rate",
    "fast heartbeat": "fast_heart_rate",
    "palpitations": "palpitations",
}

def extract_symptoms_smart(text):
    """Extract symptoms from natural language text using aliases and fuzzy matching"""
    text = text.lower().strip()
    found = set()
    
    # First check aliases (most comprehensive)
    for alias, symptom in symptom_aliases.items():
        if alias in text:
            if symptom in symptom_encoder.classes_:
                found.add(symptom)
    
    # Then check direct symptom names from encoder
    for s in symptom_encoder.classes_:
        s_clean = s.replace("_", " ").lower()
        if s_clean in text or s.lower() in text:
            found.add(s)
    
    return list(found)

def calculate_disease_match_score(symptoms, disease):
    """Calculate how well symptoms match a disease based on the disease-symptom map"""
    if disease not in disease_symptom_map or not symptoms:
        return 0
    
    disease_symptoms = set(disease_symptom_map[disease])
    input_symptoms = set(symptoms)
    
    # Calculate overlap
    common = input_symptoms.intersection(disease_symptoms)
    if len(common) == 0:
        return 0
    
    # Score based on how many input symptoms match disease symptoms
    match_ratio = len(common) / len(input_symptoms)
    return match_ratio

def calculate_symptom_severity_score(symptoms):
    """Calculate overall severity score based on symptoms (0-10 scale)"""
    if not symptoms:
        return 0
    
    total_severity = 0
    count = 0
    
    for symptom in symptoms:
        if symptom in symptom_severity:
            total_severity += symptom_severity[symptom]
            count += 1
        else:
            # Unknown symptoms get medium severity
            total_severity += 5
            count += 1
    
    return round(total_severity / count, 1) if count > 0 else 0

def check_critical_symptoms(symptoms):
    """Check if any critical symptoms are present that require immediate attention"""
    for symptom in symptoms:
        if symptom in critical_symptom_patterns:
            return True, critical_symptom_patterns[symptom]
    return False, []

def get_realistic_prediction(symptoms):
    """Get TOP 3 predictions with realistic confidence and medical filtering"""
    if not symptoms:
        return [], 0
    
    # Check for critical symptoms first (rule-based filter)
    is_critical, critical_diseases = check_critical_symptoms(symptoms)
    
    # Get model probabilities
    input_vector = symptom_encoder.transform([symptoms])
    probs = big_model.predict_proba(input_vector)[0]
    classes = big_model.classes_
    
    # Get top 10 predictions from model
    top_indices = probs.argsort()[-10:][::-1]
    
    candidates = []
    for idx in top_indices:
        disease = classes[idx]
        model_prob = probs[idx]
        
        # Calculate match score based on symptoms
        match_score = calculate_disease_match_score(symptoms, disease)
        
        # Boost score if disease matches critical symptom patterns
        critical_boost = 0.2 if (is_critical and disease in critical_diseases) else 0
        
        # Combined score: model probability + match score + critical boost
        combined_score = model_prob * 0.5 + match_score * 0.3 + critical_boost + (len(symptoms) / 20) * 0.2
        
        candidates.append({
            'disease': disease,
            'model_prob': model_prob,
            'match_score': match_score,
            'combined_score': combined_score
        })
    
    # Sort by combined score
    candidates.sort(key=lambda x: x['combined_score'], reverse=True)
    
    # Calculate severity score
    severity_score = calculate_symptom_severity_score(symptoms)
    
    # Get top 3 predictions
    top_3_predictions = []
    for i, candidate in enumerate(candidates[:3]):
        # Calculate realistic confidence based on:
        # - Number of symptoms (more symptoms = higher confidence)
        # - Match score (better match = higher confidence)
        # - Model probability
        # - Severity (higher severity = more confidence in serious diseases)
        
        symptom_count_factor = min(len(symptoms) / 4, 1.0)  # Max factor at 4+ symptoms
        position_penalty = i * 0.15  # Reduce confidence for 2nd and 3rd predictions
        
        # Base confidence calculation
        raw_confidence = (
            candidate['model_prob'] * 0.4 + 
            candidate['match_score'] * 0.3 + 
            symptom_count_factor * 0.2 +
            (severity_score / 10) * 0.1
        )
        
        # Apply position penalty
        raw_confidence = raw_confidence * (1 - position_penalty)
        
        # Scale to realistic range (35% - 92%)
        confidence = CONFIDENCE_THRESHOLD + (raw_confidence * (92 - CONFIDENCE_THRESHOLD))
        confidence = min(confidence, 92)  # Cap at 92% (never 100% certain)
        confidence = round(confidence, 1)
        
        # Only include if confidence is above threshold
        if confidence >= CONFIDENCE_THRESHOLD:
            top_3_predictions.append({
                'disease': candidate['disease'],
                'confidence': confidence,
                'is_critical': candidate['disease'] in dangerous_diseases
            })
    
    return top_3_predictions, severity_score

@app.route("/")
def home():
    return "AI Health Symptom Checker API Running"

# Predict disease from symptom list
@app.route("/predict", methods=["POST"])
def predict():
    data = request.json["symptoms"]

    disease, confidence, alternatives = get_realistic_prediction(data)
    
    if not disease:
        return jsonify({
            "disease": "Unable to determine",
            "urgency": "Low",
            "confidence": 0
        })

    # Urgency logic based on disease severity
    if disease in dangerous_diseases:
        urgency = "High"
    elif confidence > 75:
        urgency = "Medium"
    else:
        urgency = "Low"

    return jsonify({
        "disease": disease,
        "urgency": urgency,
        "confidence": confidence
    })

@app.route("/predict_text", methods=["POST"])
def predict_text():
    data = request.json
    text = data.get("text", "").strip()
    
    if not text:
        return jsonify({
            "success": False,
            "predictions": [],
            "severity_score": 0,
            "symptoms_detected": [],
            "message": "Please describe your symptoms to get a prediction"
        })

    # Extract symptoms using smart matching
    found = extract_symptoms_smart(text)

    print(f"Input: {text}")
    print(f"Detected Symptoms: {found}")

    if len(found) == 0:
        return jsonify({
            "success": False,
            "predictions": [],
            "severity_score": 0,
            "symptoms_detected": [],
            "message": "Unable to detect symptoms. Please describe more clearly (e.g., fever, headache, stomach pain, vomiting)"
        })

    # Get TOP 3 predictions with severity scoring
    top_3_predictions, severity_score = get_realistic_prediction(found)
    
    if not top_3_predictions:
        return jsonify({
            "success": False,
            "predictions": [],
            "severity_score": severity_score,
            "symptoms_detected": found,
            "message": f"Confidence too low ({CONFIDENCE_THRESHOLD}% threshold). Please provide more specific symptoms."
        })

    print(f"Top 3 Predictions: {top_3_predictions}")
    print(f"Severity Score: {severity_score}")

    # Determine overall urgency based on best prediction and severity
    best_prediction = top_3_predictions[0]
    
    if best_prediction['is_critical'] or severity_score >= 8:
        urgency = "High"
        urgency_message = "⚠️ Seek immediate medical attention"
    elif severity_score >= 6 or best_prediction['confidence'] > 75:
        urgency = "Medium"
        urgency_message = "Consult a doctor soon"
    else:
        urgency = "Low"
        urgency_message = "Monitor symptoms, see doctor if they worsen"

    # Check for critical symptoms
    has_critical, _ = check_critical_symptoms(found)
    
    # Get doctor recommendations for all predicted diseases
    predicted_diseases = [p['disease'] for p in top_3_predictions]
    doctor_recommendations = get_doctor_recommendations(predicted_diseases)

    return jsonify({
        "success": True,
        "predictions": top_3_predictions,  # Array of top 3 predictions
        "primary_disease": best_prediction['disease'],  # Most likely
        "primary_confidence": best_prediction['confidence'],
        "severity_score": severity_score,
        "urgency": urgency,
        "urgency_message": urgency_message,
        "has_critical_symptoms": has_critical,
        "symptoms_detected": found,
        "symptom_count": len(found),
        "doctor_recommendations": doctor_recommendations
    })

# ==================== USER AUTHENTICATION ====================

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    age = data.get("age", "")
    gender = data.get("gender", "")
    
    if not email or not password or not name:
        return jsonify({"success": False, "message": "Name, email and password are required"}), 400
    
    users = load_users()
    
    if email in users:
        return jsonify({"success": False, "message": "Email already registered"}), 400
    
    # Create new user
    users[email] = {
        "name": name,
        "email": email,
        "password": hash_password(password),
        "age": age,
        "gender": gender,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    save_users(users)
    
    # Initialize empty history for new user
    history = load_history()
    history[email] = []
    save_history(history)
    
    return jsonify({
        "success": True, 
        "message": "Account created successfully",
        "user": {"name": name, "email": email, "age": age, "gender": gender}
    })

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    
    if not email or not password:
        return jsonify({"success": False, "message": "Email and password are required"}), 400
    
    users = load_users()
    
    if email not in users:
        return jsonify({"success": False, "message": "User not found. Please sign up first."}), 404
    
    if users[email]["password"] != hash_password(password):
        return jsonify({"success": False, "message": "Incorrect password"}), 401
    
    user = users[email]
    return jsonify({
        "success": True,
        "message": "Login successful",
        "user": {
            "name": user["name"],
            "email": user["email"],
            "age": user.get("age", ""),
            "gender": user.get("gender", "")
        }
    })

@app.route("/user/<email>", methods=["GET"])
def get_user(email):
    users = load_users()
    email = email.lower()
    
    if email not in users:
        return jsonify({"success": False, "message": "User not found"}), 404
    
    user = users[email]
    return jsonify({
        "success": True,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "age": user.get("age", ""),
            "gender": user.get("gender", "")
        }
    })

# ==================== HISTORY MANAGEMENT ====================

@app.route("/history/<email>", methods=["GET"])
def get_history(email):
    email = email.lower()
    history = load_history()
    
    user_history = history.get(email, [])
    return jsonify({
        "success": True,
        "history": user_history,
        "count": len(user_history)
    })

@app.route("/history/add", methods=["POST"])
def add_history():
    data = request.json
    email = data.get("email", "").strip().lower()
    
    if not email:
        return jsonify({"success": False, "message": "Email is required"}), 400
    
    history = load_history()
    
    if email not in history:
        history[email] = []
    
    # Create history entry
    entry = {
        "id": len(history[email]) + 1,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "symptoms_text": data.get("symptoms_text", ""),
        "symptoms_detected": data.get("symptoms_detected", []),
        "disease": data.get("disease", ""),
        "confidence": data.get("confidence", 0),
        "urgency": data.get("urgency", "Low"),
        "possible_conditions": data.get("possible_conditions", []),
        "age": data.get("age", ""),
        "duration": data.get("duration", "")
    }
    
    history[email].insert(0, entry)  # Add to beginning (most recent first)
    
    # Keep only last 50 entries per user
    history[email] = history[email][:50]
    
    save_history(history)
    
    return jsonify({
        "success": True,
        "message": "History saved",
        "entry": entry
    })

@app.route("/history/clear/<email>", methods=["DELETE"])
def clear_history(email):
    email = email.lower()
    history = load_history()
    
    if email in history:
        history[email] = []
        save_history(history)
    
    return jsonify({"success": True, "message": "History cleared"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)
