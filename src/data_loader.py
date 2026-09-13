"""
Data Loading & Validation Module
Handles reading datasets, schema validation, and train-test splitting.
"""

import os
from typing import Tuple, Optional
import pandas as pd
from sklearn.model_selection import train_test_split

DEFAULT_RAW_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "raw", "student_performance_data.csv")
DEFAULT_PROCESSED_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "processed", "cleaned_students.csv")

REQUIRED_COLUMNS = [
    "student_id", "name", "gender", "age", "grade_level",
    "parental_education", "study_hours_per_week", "attendance_rate",
    "internet_access", "extracurricular_activities", "test_prep_course",
    "sleep_hours", "previous_score", "math_score", "science_score",
    "english_score", "final_score", "passed", "risk_level"
]

def load_raw_data(filepath: Optional[str] = None) -> pd.DataFrame:
    """Load raw student dataset from CSV file."""
    path = filepath or DEFAULT_RAW_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Raw data file not found at: {path}")
    df = pd.read_csv(path)
    validate_schema(df)
    return df

def load_processed_data(filepath: Optional[str] = None) -> pd.DataFrame:
    """Load preprocessed student dataset from CSV file."""
    path = filepath or DEFAULT_PROCESSED_PATH
    if not os.path.exists(path):
        # Fall back to raw if processed doesn't exist
        return load_raw_data()
    return pd.read_csv(path)

def validate_schema(df: pd.DataFrame) -> bool:
    """Ensure dataframe has all expected core columns."""
    missing = [c for c in REQUIRED_COLUMNS if c not in df.columns]
    if missing:
        raise ValueError(f"Dataset missing required columns: {missing}")
    return True

def get_train_test_data(
    filepath: Optional[str] = None,
    test_size: float = 0.2,
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Load dataset and return stratified or random train/test splits."""
    df = load_raw_data(filepath)
    train_df, test_df = train_test_split(
        df,
        test_size=test_size,
        random_state=random_state,
        stratify=df["risk_level"]
    )
    return train_df.reset_index(drop=True), test_df.reset_index(drop=True)
