import pickle
import pandas as pd

with open("score_forest_model.pkl", "rb") as file:
    loaded_model = pickle.load(file)
print("Model loaded successfully.")

input_data = {
    "Gender": "Male",
    "Age_30+": "No",
    "Empl_Status": "Student",
    "City": "Tier 1 (Delhi, Mumbai, Bangalore, Chennai, Kolkata)",
    "Feeling_Today": "Fine",
    "Eat_Sleep": "No",
    "Sadness_Duration": "Significant time",
    "Low_Time": "Evening",
    "Life_Change": "No",
    "Stress_Area": "Personal",
    "Anhedonia": "Never",
    "Confidence": 2,
    "Social_Support": "Little bit",
    "Meaningful_Activities": "Never",
    "MH_Work_Impact": "No",
    "MH_Leave_Ease": "Very easy",
    "Substance_Use": "Never",
    "Concentration": "Maybe",
    "Prediction_Status": "No",
}
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
    "Stress_Area",
    "Anhedonia",
    "Social_Support",
    "Meaningful_Activities",
    "MH_Work_Impact",
    "MH_Leave_Ease",
    "Substance_Use",
    "Concentration",
    "Prediction_Status",
]
df = pd.read_csv("./Dataset.csv")

num_columns = len(df.columns)

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

df.isnull().sum()

df = df.fillna(df.mean(numeric_only=True))
df = df.dropna(axis=1)

df.isnull().sum()


single_df = pd.DataFrame([input_data])
X = df.drop("Prediction", axis=1)

single_df_encoded = pd.get_dummies(single_df, columns=categorical_features)
X_encoded = pd.get_dummies(X, columns=categorical_features)


missing_columns = set(X_encoded.columns) - set(single_df_encoded.columns)
for col in missing_columns:
    single_df_encoded[col] = 0

single_df_encoded = single_df_encoded[X_encoded.columns]

single_prediction = loaded_model.predict(single_df_encoded)

print("Single Prediction:", single_prediction)
