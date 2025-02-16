from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load trained model
model = joblib.load("career_skill_predictor.pkl")

# Sample feature columns (same as in training)
feature_columns = [
    "Age", "Education_Bachelor's", "Education_High School", "Education_Master's", "Education_PhD",
    "Occupation_Job Seeker", "Occupation_Student", "Occupation_Working Professional",
    "Interest_AI/ML", "Interest_Blockchain", "Interest_Cloud Computing",
    "Interest_Full Stack Development", "Interest_Networking",
    "Experience_Beginner", "Experience_Intermediate", "Experience_Advanced",
    "Learning Style_Auditory", "Learning Style_Kinesthetic", "Learning Style_Reading/Writing", "Learning Style_Visual",
    "Time Commitment_<5 hrs/week", "Time Commitment_5-10 hrs/week", "Time Commitment_>10 hrs/week",
    "Preferred Resources_Free", "Preferred Resources_Free & Paid", "Preferred Resources_Paid"
]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        df = pd.DataFrame([data])
        
        # One-hot encoding
        df_encoded = pd.get_dummies(df)
        df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)  # Ensure all columns exist

        # Predict
        prediction = model.predict(df_encoded)[0]

        return jsonify({"skill": prediction})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
