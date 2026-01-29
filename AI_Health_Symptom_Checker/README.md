# AI Health Symptom Checker

An AI-powered web application that predicts potential diseases based on user-reported symptoms using Machine Learning.

## 🏥 Features

- **User Authentication**: Register and login functionality
- **Symptom Selection**: Interactive symptom checklist
- **AI Prediction**: Machine learning model predicts potential diseases
- **Health Recommendations**: Provides recommendations based on predicted disease
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Project Structure

```
AI_Health_Symptom_Checker/
│
├── backend/
│   ├── app.py              # Flask API server
│   ├── train_model.py      # ML model training script
│   ├── model.pkl           # Trained model (generated after training)
│   ├── dataset.csv         # Training dataset
│   ├── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── package.json        # Node.js dependencies
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── App.css         # Styles
│   │   ├── index.js        # Entry point
│   │   ├── pages/
│   │   │   ├── Login.js        # Login/Register page
│   │   │   ├── SymptomForm.js  # Symptom selection page
│   │   │   └── Result.js       # Diagnosis result page
│   │   ├── components/
│   │   │   └── Navbar.js       # Navigation bar
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd AI_Health_Symptom_Checker/backend
   ```

2. Create a virtual environment (recommended):

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Train the ML model:

   ```bash
   python train_model.py
   ```

5. Start the Flask server:
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd AI_Health_Symptom_Checker/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## 🔧 API Endpoints

| Method | Endpoint        | Description                       |
| ------ | --------------- | --------------------------------- |
| POST   | `/api/register` | Register a new user               |
| POST   | `/api/login`    | User login                        |
| GET    | `/api/symptoms` | Get list of symptoms              |
| POST   | `/api/predict`  | Predict disease based on symptoms |
| GET    | `/api/health`   | Health check endpoint             |

## 🧠 Machine Learning Model

The application uses a **Random Forest Classifier** trained on symptom-disease data. The model considers the following symptoms:

- Fever
- Cough
- Fatigue
- Headache
- Body Pain
- Sore Throat
- Runny Nose
- Nausea
- Shortness of Breath

### Supported Diseases

- Flu
- Common Cold
- Viral Fever
- Throat Infection
- COVID-19
- Migraine
- Food Poisoning
- Allergic Rhinitis
- Pneumonia
- Tension Headache

## ⚠️ Disclaimer

This application is for educational purposes only and should **NOT** be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
