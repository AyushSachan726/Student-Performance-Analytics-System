# Student Performance Analytics System

An enterprise-grade Machine Learning and Data Science platform engineered to evaluate academic health, forecast student examination outcomes, detect at-risk cohorts, and deliver actionable educational interventions through an asynchronous FastAPI service and an interactive Streamlit analytics portal.

---

## Architecture Overview

The system adheres to modular data science and machine learning engineering standards:

```text
├── data/
│   ├── raw/
│   │   └── student_performance_data.csv    # Primary dataset containing 12,500 records
│   └── processed/
│       └── cleaned_students.csv            # Preprocessed data with engineered features
├── notebooks/
│   └── 01_eda_and_modeling.ipynb           # Statistical analysis, correlation heatmaps, baseline experiments
├── src/
│   ├── __init__.py                         # Package initialization
│   ├── data_loader.py                      # Data validation, ingestion, and stratified train/test split
│   ├── features.py                         # Scikit-learn ColumnTransformer, scaling, and feature engineering
│   ├── train.py                            # Automated model tournament, cross-validation, and artifact serialization
│   ├── evaluate.py                         # Evaluation metrics computation and feature importance extraction
│   └── predict.py                          # Production inference pipeline and recommendation engine
├── models/
│   ├── best_student_model.joblib           # Trained regression model artifact
│   ├── risk_classifier.joblib              # Trained risk category classifier artifact
│   ├── preprocessor.joblib                 # Serialized ColumnTransformer pipeline
│   └── metrics.json                        # Comprehensive tournament benchmark log
├── app/
│   ├── api.py                              # High-performance FastAPI REST service
│   └── streamlit_app.py                    # Production Streamlit analytics dashboard
├── frontend/                               # Preserved React/Vite web application
├── requirements.txt                        # Python dependencies
└── README.md                               # Technical documentation
```

---

## Core Capabilities

1. **Descriptive Analytics**: Real-time KPI monitoring including cohort size, average score, pass rates, and attendance distributions.
2. **Diagnostic Analytics**: Factor analysis examining the impact of attendance thresholds, weekly study duration, sleep hygiene, and socioeconomic indicators.
3. **Predictive Modeling**: Automated regression and classification models forecasting continuous final exam scores and categorical risk classifications (Low, Medium, High).
4. **Prescriptive Guidance**: Rule-based academic intervention engine recommending targeted actions based on individual weaknesses.
5. **Custom Data Ingestion**: Flexible CSV upload mechanism with on-the-fly model inference and instant dashboard synchronization.

---

## Installation & Environment Setup

### Prerequisites
- Python 3.10 or higher
- PowerShell, Command Prompt, or Unix Shell

### 1. Clone the Repository
```bash
git clone https://github.com/AyushSachan726/Student-Performance-Analytics-System.git
cd Student-Performance-Analytics-System
```

### 2. Set Up Virtual Environment (Recommended)
```bash
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# Linux / macOS
source .venv/bin/activate
```

### 3. Install Required Dependencies
```bash
pip install -r requirements.txt
```

---

## Execution Guide

### 1. Model Training & Pipeline Execution
To execute the data loader, apply feature transformations, benchmark candidate algorithms (Ridge Regression, Random Forest, Gradient Boosting), and export serialized `.joblib` models:

```bash
python src/train.py
```

### 2. Interactive Analytics Dashboard (Streamlit)
Launch the Streamlit web application:

```bash
python -m streamlit run app/streamlit_app.py
```
- Access the portal at: `http://localhost:8501`
- Theme: Designed with a modern, high-contrast dark palette (Raisin Black `#232323`, Buff `#CDA175`, and Sunset `#EBCC98`).

### 3. REST API Server (FastAPI)
Launch the asynchronous inference service using Uvicorn:

```bash
python -m uvicorn app.api:app --reload --port 8000
```
- API Root: `http://localhost:8000`
- Interactive OpenAPI Documentation (Swagger UI): `http://localhost:8000/docs`
- ReDoc Technical Reference: `http://localhost:8000/redoc`

### 4. Exploratory Data Analysis (EDA) Notebook
Inspect data distributions, correlation heatmaps, and baseline model experiments:

```bash
jupyter notebook notebooks/01_eda_and_modeling.ipynb
```

---

## Model Benchmarks & Evaluation (Tested on 12,500+ Records)

Evaluation performed on a 12,500 student record dataset (10,000 training partition, 2,500 holdout test partition):

### Regression Performance (Final Score Prediction)

| Model Architecture | R2 Score | RMSE | MAE |
| :--- | :---: | :---: | :---: |
| **Ridge Regression (Selected)** | **0.8470** | **3.98** | **3.19** |
| Gradient Boosting Regressor | 0.8421 | 4.04 | 3.25 |
| Random Forest Regressor | 0.8387 | 4.08 | 3.28 |

### Classification Performance (Risk Tier Identification)
- **Model**: Random Forest Classifier (100 estimators, max depth 8)
- **Accuracy**: **88.96%** on holdout test partition (2,500 unseen students)
- **Categories**: Low Risk (Score >= 75%), Medium Risk (55% to 74%), High Risk (< 55%)

### Inference Latency & Scalability
- **Single Record Prediction**: **42.6 ms** (sub-50ms real-time API latency)
- **Batch Processing Throughput**: **15.0 ms / student** (1,000 predictions processed in ~15.05 seconds)

### Key Feature Determinants
1. **Attendance Rate**: Strongest correlation with passing outcomes.
2. **Weekly Study Hours & Study-Attendance Index**: Critical drivers of score gains.
3. **Mid-term STEM Subject Scores (Mathematics & Science)**: Baseline indicators of performance stability.
4. **Test Preparation Course Completion**: Statistically significant margin in final grading.
5. **Parental Education Level**: Secondary indicator of academic support structure.

---

## API Endpoints Reference

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Health check and service metadata |
| `POST` | `/predict` | Single student inference returning score, grade, risk, and recommendations |
| `POST` | `/batch-predict` | Batch inference processing multiple student profiles |
| `GET` | `/students` | Query student records with optional filters (`grade`, `risk`, `search`, `limit`) |
| `GET` | `/metrics` | Retrieve active model performance statistics and feature weights |
| `POST` | `/retrain` | Trigger automated training pipeline and reload model in memory |

### Sample Prediction Payload
```json
{
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
```

---

## Data Pipeline Specifications

- **Input Features**: 14 attributes combining numerical, categorical, and behavioral variables.
- **Engineered Metrics**:
  - `stem_average`: Mean of mathematics and science assessments.
  - `study_attendance_index`: Interaction variable quantifying effective study discipline.
- **Preprocessing**: `StandardScaler` for numeric normalization, `OneHotEncoder(drop='first', handle_unknown='ignore')` for categorical dimensions.

---

## Technical Stack

- **Core Engine**: Python 3.10+
- **Machine Learning**: Scikit-learn, Joblib, NumPy, Pandas
- **Web Application & UI**: Streamlit, Plotly Express, Plotly Graph Objects
- **Backend API**: FastAPI, Uvicorn, Pydantic v2
- **Data Exploration**: Jupyter Notebook, Matplotlib, Seaborn

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.
