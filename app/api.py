"""
FastAPI Backend Application
Provides REST endpoints for student performance prediction, analytics, and model management.
"""

import os
import sys
import json
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# Ensure root directory in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.predict import StudentPredictor
from src.data_loader import load_raw_data
from src.train import run_training

app = FastAPI(
    title="Student Performance Analytics & ML API",
    description="REST API for predicting student grades, assessing academic risk, and serving analytics.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize predictor singleton
try:
    predictor = StudentPredictor()
except Exception as e:
    print(f"Warning: Predictor could not be initialized at startup: {e}")
    predictor = None


# ─── Pydantic Schemas ──────────────────────────────────────────
class StudentInput(BaseModel):
    gender: str = Field(..., example="Female", description="Student gender (Female / Male)")
    age: int = Field(17, ge=14, le=22, description="Age between 14 and 22")
    grade_level: str = Field("Grade 11", example="Grade 11", description="Grade 10, Grade 11, or Grade 12")
    parental_education: str = Field(
        "Bachelor's Degree",
        example="Bachelor's Degree",
        description="High School, Some College, Associate Degree, Bachelor's Degree, Master's Degree"
    )
    study_hours_per_week: float = Field(12.5, ge=0.0, le=50.0, description="Weekly study hours")
    attendance_rate: float = Field(85.0, ge=0.0, le=100.0, description="Attendance percentage (0-100)")
    internet_access: str = Field("Yes", example="Yes", description="Yes or No")
    extracurricular_activities: str = Field("Yes", example="Yes", description="Yes or No")
    test_prep_course: str = Field("Completed", example="Completed", description="Completed or Not Completed")
    sleep_hours: float = Field(7.0, ge=3.0, le=12.0, description="Average sleep hours per night")
    previous_score: float = Field(75.0, ge=0.0, le=100.0, description="Previous term GPA/score")
    math_score: float = Field(78.0, ge=0.0, le=100.0, description="Math mid-term score")
    science_score: float = Field(80.0, ge=0.0, le=100.0, description="Science mid-term score")
    english_score: float = Field(76.0, ge=0.0, le=100.0, description="English mid-term score")


class PredictionResponse(BaseModel):
    predicted_score: float
    predicted_grade: str
    predicted_risk: str
    passed: bool
    recommendation: str


# ─── Endpoints ─────────────────────────────────────────────────
@app.get("/")
def root():
    """Health check & API info."""
    return {
        "status": "healthy",
        "service": "Student Performance Analytics System API",
        "version": "1.0.0",
        "model_loaded": predictor is not None,
        "endpoints": ["/predict", "/students", "/metrics", "/retrain", "/docs"]
    }


@app.post("/predict", response_model=PredictionResponse)
def predict_student_performance(student: StudentInput):
    """Predict expected score, letter grade, and academic risk category for a student."""
    global predictor
    if predictor is None:
        try:
            predictor = StudentPredictor()
        except Exception as err:
            raise HTTPException(status_code=500, detail=f"Model not initialized: {err}")
            
    try:
        data_dict = student.model_dump()
        result = predictor.predict_one(data_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")


@app.post("/batch-predict", response_model=List[PredictionResponse])
def batch_predict(students: List[StudentInput]):
    """Predict performance for a batch of student records."""
    global predictor
    if predictor is None:
        predictor = StudentPredictor()
    data_list = [s.model_dump() for s in students]
    return predictor.predict_batch(data_list)


@app.get("/students")
def get_students(
    grade: Optional[str] = Query(None, description="Filter by grade_level"),
    risk: Optional[str] = Query(None, description="Filter by risk_level (Low, Medium, High)"),
    search: Optional[str] = Query(None, description="Search by student name or ID"),
    limit: int = Query(50, ge=1, le=1200)
):
    """Query student records with optional filtering."""
    try:
        df = load_raw_data()
        if grade:
            df = df[df["grade_level"].str.lower() == grade.lower()]
        if risk:
            df = df[df["risk_level"].str.lower() == risk.lower()]
        if search:
            q = search.lower()
            df = df[df["name"].str.lower().str.contains(q) | df["student_id"].str.lower().str.contains(q)]
            
        total_count = len(df)
        records = df.head(limit).to_dict(orient="records")
        return {
            "total_matches": total_count,
            "limit": limit,
            "students": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/metrics")
def get_model_metrics():
    """Retrieve evaluation metrics and feature importances for active models."""
    metrics_path = os.path.join(PROJECT_ROOT, "models", "metrics.json")
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="No trained model metrics found. Please trigger /retrain first.")
    with open(metrics_path, "r") as f:
        data = json.load(f)
    return data


@app.post("/retrain")
def retrain_models():
    """Trigger complete training pipeline and hot-reload updated model."""
    global predictor
    try:
        metadata = run_training()
        predictor = StudentPredictor()
        return {
            "status": "success",
            "message": "Model re-trained and reloaded successfully.",
            "metrics": metadata
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")
