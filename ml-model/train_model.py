import pandas as pd
import random
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Define possible values
ages = list(range(18, 40))
education_levels = ["High School", "Bachelor's", "Master's", "PhD"]
occupations = ["Student", "Job Seeker", "Working Professional"]
interests = ["AI/ML", "Full Stack Development", "Blockchain", "Cloud Computing", "Networking"]
experience_levels = ["Beginner", "Intermediate", "Advanced"]
learning_styles = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"]
time_commitments = ["<5 hrs/week", "5-10 hrs/week", ">10 hrs/week"]
resources = ["Free", "Paid", "Free & Paid"]
skills = {
    "AI/ML": "AI/ML",
    "Full Stack Development": "Full-Stack Development",
    "Blockchain": "Blockchain",
    "Cloud Computing": "Cloud Computing",
    "Networking": "Networking"
}

# Generate dataset
data = []
for _ in range(1000):
    age = random.choice(ages)
    edu = random.choice(education_levels)
    occ = random.choice(occupations)
    interest = random.choice(interests)
    exp = random.choice(experience_levels)
    learn_style = random.choice(learning_styles)
    time = random.choice(time_commitments)
    resource = random.choice(resources)
    skill = skills[interest]

    data.append([age, edu, occ, interest, exp, learn_style, time, resource, skill])

# Convert to DataFrame
df = pd.DataFrame(data, columns=["Age", "Education", "Occupation", "Interest", "Experience", "Learning Style", "Time Commitment", "Preferred Resources", "Recommended Skill"])

# Encode categorical data
df_encoded = pd.get_dummies(df.drop(columns=["Recommended Skill"]))  # Drop target variable
y = df["Recommended Skill"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(df_encoded, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, "career_skill_predictor.pkl")

print("✅ Model trained and saved successfully!")
