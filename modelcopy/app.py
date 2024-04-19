from distutils.log import debug
import pickle
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
import matplotlib.pyplot as plt

model = pickle.load(open("model.pkl", "rb"))
loaded_model = pickle.load(open("scorerandom_forest.pkl", "rb"))

df = pd.read_csv("Dataset.csv")

print("Column Names:")
print(df.columns)
num_columns = len(df.columns)
print("\nNumber of Columns:", num_columns)

df = df.drop(["Id", "Timestamp", "Email address", "Name"], axis=1)

short_names = {
    "Gender": "Gender",
    "Are you above 30 years of age?": "Age_30+",
    "Employment Status": "Empl_Status",
    "City": "City",
    "How are you feeling today?": "Feeling_Today",
    "eating and sleeping": "Eat_Sleep",
    "(If sad)have you been in the same mental state for the past few days?": "Sad_State_Recent",
    "Is your sadness momentarily or has it been constant for a long time?": "Sadness_Duration",
    "At what time of the day are you extremely low?": "Low_Time",
    "Has there been a sudden and huge change in your life?": "Life_Change",
    "Your stress is related to which of the following areas?": "Stress_Area",
    "How frequently have you had little pleasure or interest in the activities you usually enjoy?": "Anhedonia",
    "How confident you have been feeling in your capabilities recently.": "Confidence",
    "Describe how ‘supported’ you feel by others around you – your friends, family, or otherwise.": "Social_Support",
    "How frequently have you been doing things that mean something to you or your life?": "Meaningful_Activities",
    "If you have a mental health condition, do you feel that it interferes with your work?": "MH_Work_Impact",
    "How easy is it for you to take medical leave for a mental health condition?": "MH_Leave_Ease",
    "How often do you make use of substance abuse(e.g. smoking, alcohol)?": "Substance_Use",
    "Have you taken any therapy or medication in the near past for mental health?": "MH_Treatment",
    "Having trouble concentrating on things, such as reading the newspaper or watching television, or studying?": "Concentration",
    "Do you feel bad about yourself — or that you are a failure or have let yourself or your family down?": "Self_Esteem",
    "How many hours do you spend per day on watching mobile phone, laptop, computer, television, etc.?": "Screen_Time",
    "If sad, how likely are you to take an appointment with a psychologist or a counsellor for your current mental state?": "Sad_Help_Seeking",
    "Has the COVID-19 pandemic affected your mental well being?": "Covid_Mental_Impact",
    "How often do you get offended or angry or start crying ?": "Anger_Crying",
    "How likely do you feel yourself vulnerable or lonely?": "Vulnerability_Loneliness",
    "How comfortable are you in talking about your mental health?": "MH_Disclosure",
    "Prediction": "Prediction",
    "Prediction_status": "Prediction_Status",
}

df = df.rename(columns=short_names)
df = df[df["Gender"] != "Prefer not to say"]

stress_areas_to_delete = [
    "Work, Financial, Personal",
    "Home, Work, Financial",
    "Home, Financial, Personal",
    "Home, Financial",
    "Personal, None",
    "Home, Work, Financial, Personal, None",
]

df = df[~df["Stress_Area"].isin(stress_areas_to_delete)]
df.reset_index(drop=True, inplace=True)
df = df.drop(
    [
        "Sad_State_Recent",
        "MH_Disclosure",
        "Sad_Help_Seeking",
        "Vulnerability_Loneliness",
    ],
    axis=1,
)
df = df.fillna(df.mean(numeric_only=True))
df = df.dropna(axis=1)
X = df.drop(["Prediction", "Prediction_Status"], axis=1)


app = Flask(__name__)
CORS(app)

categorical_features = [
    "Gender",
    "Age_30+",
    "Empl_Status",
    "City",
    "Feeling_Today",
    "Eat_Sleep",
    "Sadness_Duration",
    "Low_Time",
    "Life_Change",
    "Anhedonia",
    "Social_Support",
    "Meaningful_Activities",
    "MH_Work_Impact",
    "MH_Leave_Ease",
    "Substance_Use",
    "Concentration",
]


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    selected_values = data.get("selectedValues")
    if request.method == "POST":
        Gender = selected_values[0]
        age = selected_values[1]
        emp_status = selected_values[2]
        city = selected_values[3]
        feeling_today = selected_values[4]
        eat_and_sleep = selected_values[5]
        sadness_duration = selected_values[6]
        low_time = selected_values[7]
        life_change = selected_values[8]
        stress_area = selected_values[9]
        Anhedonia = selected_values[10]
        confidence = selected_values[11]
        soc_support = selected_values[12]
        good_things = selected_values[13]
        impact = selected_values[14]
        leave = selected_values[15]
        substance_use = selected_values[16]
        concent = selected_values[17]

        print(age)
        print(city)

        if Gender == 0:
            Gender = "Male"
        elif Gender == 1:
            Gender = "Female"

        if age == 0:
            age = "Yes"
        elif age == 1:
            age = "No"

        if emp_status == 0:
            emp_status = "Employed"
        elif emp_status == 1:
            emp_status = "Student"

        if city == 0:
            city = "Tier 1 (Delhi, Mumbai, Bangalore, Chennai, Kolkata)"
        elif city == 2:
            city = "Tier 2 (Capital cities Eg. Lucknow )"
        elif city == 3:
            city = "Tier 3 (Other cities/towns)"

        if feeling_today == 0:
            feeling_today = "Good"
        elif feeling_today == 1:
            feeling_today = "Fine"
        elif feeling_today == 2:
            feeling_today = "Sad"
        elif feeling_today == 3:
            feeling_today = "Depressed"

        if eat_and_sleep == 0:
            eat_and_sleep = "Yes"
        elif eat_and_sleep == 1:
            eat_and_sleep = "No"
        elif eat_and_sleep == 2:
            eat_and_sleep = "Maybe"

        if sadness_duration == 0:
            sadness_duration = "For some time"
        elif sadness_duration == 1:
            sadness_duration = "Not sad"
        elif sadness_duration == 2:
            sadness_duration = "Significant time"
        elif sadness_duration == 3:
            sadness_duration = "Long time"

        if low_time == 0:
            low_time = "Evening"
        elif low_time == 1:
            low_time = "Afternoon"
        elif low_time == 2:
            low_time = "Morning"

        if life_change == 0:
            life_change = "No"
        elif life_change == 1:
            life_change = "Yes"
        elif life_change == 2:
            life_change = "Not sure"

        if substance_use == 0:
            substance = "Sometimes"
        elif substance_use == 1:
            substance = "Never"
        elif substance_use == 2:
            substance = "often"

        if stress_area == 0:
            stress_area = "Personal"
        elif stress_area == 1:
            stress_area = "Work"
        elif stress_area == 2:
            stress_area = "Home, Personal"
        elif stress_area == 3:
            stress_area = "Work, Personal"
        elif stress_area == 4:
            stress_area = "Home, Work, Personal"
        elif stress_area == 5:
            stress_area = "Financial"
        elif stress_area == 6:
            stress_area = "Home, Work, Financial, Personal"
        elif stress_area == 7:
            stress_area = "Financial, Personal"
        elif stress_area == 8:
            stress_area = "Home"
        elif stress_area == 9:
            stress_area = "Work, Financial"
        elif stress_area == 10:
            stress_area = "Home, Work"

        if Anhedonia == 0:
            Anhedonia = "Sometimes"
        elif Anhedonia == 1:
            Anhedonia = "Often"
        elif Anhedonia == 2:
            Anhedonia = "Very Often"
        elif Anhedonia == 3:
            Anhedonia = "Never"

        if confidence == 0:
            confidence = 5
        elif confidence == 1:
            confidence = 4
        elif confidence == 2:
            confidence = 3
        elif confidence == 3:
            confidence = 2
        elif confidence == 4:
            confidence = 1

        if concent == 0:
            concentration = "Yes"
        elif concent == 1:
            concentration = "No"
        elif concent == 2:
            concentration = "Maybe"

        if soc_support == 0:
            social_support = "Not at all"
        elif soc_support == 1:
            social_support = "Little bit"
        elif soc_support == 2:
            social_support = "Average"
        elif soc_support == 3:
            social_support = "Satisfactory"
        elif soc_support == 4:
            social_support = "Poor"
        elif soc_support == 5:
            social_support = "Highly supportive"

        if good_things == 0:
            good_things = "Often"
        elif good_things == 1:
            good_things = "Sometimes"
        elif good_things == 2:
            good_things = "Very Often"
        elif good_things == 3:
            good_things = "Never"

        if impact == 0:
            impact = "Yes"
        elif impact == 1:
            impact = "No"
        elif impact == 2:
            impact = "Maybe"

        if leave == 0:
            MH_leave = "Difficult"
        elif leave == 1:
            MH_leave = "Not so easy"
        elif leave == 2:
            MH_leave = "Easy"
        elif leave == 2:
            MH_leave = "Very easy"

        input_data = {
            "Gender": Gender,
            "Age_30+": age,
            "Empl_Status": emp_status,
            "City": city,
            "Feeling_Today": feeling_today,
            "Eat_Sleep": eat_and_sleep,
            "Sadness_Duration": sadness_duration,
            "Low_Time": low_time,
            "Life_Change": life_change,
            "Stress_Area": stress_area,
            "Anhedonia": Anhedonia,
            "Confidence": confidence,
            "Social_Support": social_support,
            "Meaningful_Activities": good_things,
            "MH_Work_Impact": impact,
            "MH_Leave_Ease": MH_leave,
            "Substance_Use": substance,
            "Concentration": concentration,
        }

        print(input_data)

        single_df = pd.DataFrame([input_data])
        X_encoded = pd.get_dummies(X, columns=categorical_features)

        single_df_encoded = pd.get_dummies(single_df, columns=categorical_features)
        missing_columns = set(X_encoded.columns) - set(single_df_encoded.columns)
        for col in missing_columns:
            single_df_encoded[col] = 0
        single_df_encoded = single_df_encoded[X_encoded.columns]
        single_prediction = loaded_model.predict(single_df_encoded)
        print("Single Prediction:", single_prediction)

        body = {}
        data = {}

        if single_prediction[0] >= 34:
            data["class"] = "1"
        else:
            data["class"] = "0"

        data["score"] = str(single_prediction[0])
        body["data"] = data
        response = jsonify(body)
        return response


if __name__ == "__main__":
    app.run(debug=True)
