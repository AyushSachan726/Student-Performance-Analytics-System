import os
import sys
import joblib
import pandas as pd
from typing import Dict, Any, Union, List

# Ensure project root in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.features import engineer_features

DEFAULT_MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "best_student_model.joblib")
DEFAULT_CLF_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "risk_classifier.joblib")

class StudentPredictor:
    """Wrapper for generating predictions from trained student performance models."""
    
    def __init__(self, model_path: str = DEFAULT_MODEL_PATH, clf_path: str = DEFAULT_CLF_PATH):
        self.model_path = model_path
        self.clf_path = clf_path
        self.model = None
        self.classifier = None
        self._load_artifacts()
        
    def _load_artifacts(self):
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(
                f"Model file not found at {self.model_path}. "
                "Please run `python src/train.py` first to train and save models."
            )
        self.model = joblib.load(self.model_path)
        if os.path.exists(self.clf_path):
            self.classifier = joblib.load(self.clf_path)

    @staticmethod
    def _calculate_letter_grade(score: float) -> str:
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 50:
            return "D"
        else:
            return "F"

    @staticmethod
    def _generate_recommendation(predicted_score: float, risk_level: str, student_data: Dict[str, Any]) -> str:
        recommendations = []
        if student_data.get("attendance_rate", 100) < 75:
            recommendations.append("Attendance is below 75%. Minimum 85% attendance required to prevent academic warning.")
        if student_data.get("study_hours_per_week", 10) < 10:
            recommendations.append("Increase weekly focused study time to at least 12-15 hours.")
        if student_data.get("test_prep_course") != "Completed":
            recommendations.append("Enrolling in a structured test preparation module is strongly recommended.")
        if student_data.get("math_score", 70) < 55:
            recommendations.append("Provide remedial math tutoring and weekly problem set reviews.")
            
        if not recommendations:
            if predicted_score >= 85:
                recommendations.append("Outstanding academic momentum. Encourage participation in advanced STEM or honors courses.")
            else:
                recommendations.append("Consistent performance. Maintain current study routine and exam readiness.")
                
        return " | ".join(recommendations)

    def predict_one(self, student_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict performance score, grade, and risk for a single student dictionary."""
        df_input = pd.DataFrame([student_data])
        df_feat = engineer_features(df_input)
        
        predicted_score = float(self.model.predict(df_feat)[0])
        predicted_score = round(max(0.0, min(100.0, predicted_score)), 1)
        
        if self.classifier:
            predicted_risk = str(self.classifier.predict(df_feat)[0])
        else:
            if predicted_score >= 75:
                predicted_risk = "Low"
            elif predicted_score >= 55:
                predicted_risk = "Medium"
            else:
                predicted_risk = "High"
                
        letter_grade = self._calculate_letter_grade(predicted_score)
        passed = predicted_score >= 50.0
        recommendation = self._generate_recommendation(predicted_score, predicted_risk, student_data)
        
        return {
            "predicted_score": predicted_score,
            "predicted_grade": letter_grade,
            "predicted_risk": predicted_risk,
            "passed": passed,
            "recommendation": recommendation
        }

    def predict_batch(self, students: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Predict results for a list of student records."""
        return [self.predict_one(s) for s in students]

    def predict_sample(self) -> Dict[str, Any]:
        """Test inference with default sample student profile."""
        sample = {
            "gender": "Female",
            "age": 17,
            "grade_level": "Grade 11",
            "parental_education": "Bachelor's Degree",
            "study_hours_per_week": 14.5,
            "attendance_rate": 88.0,
            "internet_access": "Yes",
            "extracurricular_activities": "Yes",
            "test_prep_course": "Completed",
            "sleep_hours": 7.0,
            "previous_score": 78.0,
            "math_score": 82.0,
            "science_score": 85.0,
            "english_score": 80.0
        }
        return self.predict_one(sample)
