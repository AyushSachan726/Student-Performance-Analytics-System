"""
Feature Engineering & Transformation Pipeline Module
Handles feature definition, preprocessing pipelines, and transformations.
"""

from typing import List, Tuple
import pandas as pd
import numpy as np
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

NUMERICAL_FEATURES: List[str] = [
    "study_hours_per_week",
    "attendance_rate",
    "sleep_hours",
    "previous_score",
    "math_score",
    "science_score",
    "english_score"
]

CATEGORICAL_FEATURES: List[str] = [
    "gender",
    "grade_level",
    "parental_education",
    "internet_access",
    "extracurricular_activities",
    "test_prep_course"
]

TARGET_REGRESSION = "final_score"
TARGET_CLASSIFICATION = "risk_level"

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add derived domain features to enhance model predictions."""
    df_feat = df.copy()
    
    # Study efficiency & engagement index
    df_feat["study_attendance_index"] = (
        (df_feat["study_hours_per_week"] * df_feat["attendance_rate"]) / 100.0
    ).round(2)
    
    # STEM subject average
    df_feat["stem_average"] = (
        (df_feat["math_score"] + df_feat["science_score"]) / 2.0
    ).round(2)
    
    return df_feat

def get_feature_columns() -> Tuple[List[str], List[str]]:
    """Return lists of numerical and categorical feature column names."""
    engineered_numerical = NUMERICAL_FEATURES + ["study_attendance_index", "stem_average"]
    return engineered_numerical, CATEGORICAL_FEATURES

def build_preprocessor() -> ColumnTransformer:
    """
    Construct a scikit-learn ColumnTransformer that standardizes numerical
    features and one-hot encodes categorical features.
    """
    num_cols, cat_cols = get_feature_columns()
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), num_cols),
            ("cat", OneHotEncoder(drop="first", handle_unknown="ignore", sparse_output=False), cat_cols)
        ],
        remainder="drop"
    )
    return preprocessor

def get_transformed_feature_names(preprocessor: ColumnTransformer) -> List[str]:
    """Extract readable output feature names from fitted ColumnTransformer."""
    feature_names = []
    for name, trans, cols in preprocessor.transformers_:
        if name == "num":
            feature_names.extend(cols)
        elif name == "cat":
            cat_names = list(trans.get_feature_names_out(cols))
            feature_names.extend(cat_names)
    return feature_names
