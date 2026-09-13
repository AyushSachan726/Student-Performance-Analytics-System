"""
Model Training & Experimentation Pipeline
Trains regression & risk classification models, evaluates performance,
and saves production artifacts to the models/ directory.
"""

import os
import sys
import json
import joblib
from datetime import datetime

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, RandomForestClassifier
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline

from src.data_loader import get_train_test_data
from src.features import (
    engineer_features,
    build_preprocessor,
    get_transformed_feature_names,
    TARGET_REGRESSION,
    TARGET_CLASSIFICATION
)
from src.evaluate import evaluate_regression, evaluate_classification, extract_feature_importance

MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

def run_training():
    """Execute complete training pipeline and save artifacts."""
    os.makedirs(MODELS_DIR, exist_ok=True)
    print("=" * 60)
    print("[*] Starting Student Performance ML Training Pipeline")
    print("=" * 60)
    
    # 1. Load split data
    print("[+] Loading & Splitting dataset...")
    train_df, test_df = get_train_test_data()
    print(f"    Train set: {len(train_df)} rows | Test set: {len(test_df)} rows")
    
    # 2. Feature Engineering
    print("[+] Applying feature transformations...")
    train_feat = engineer_features(train_df)
    test_feat = engineer_features(test_df)
    
    y_train_reg = train_feat[TARGET_REGRESSION]
    y_test_reg = test_feat[TARGET_REGRESSION]
    
    y_train_clf = train_feat[TARGET_CLASSIFICATION]
    y_test_clf = test_feat[TARGET_CLASSIFICATION]
    
    # 3. Model Candidates
    candidates = {
        "Ridge_Regression": Ridge(alpha=1.0),
        "Random_Forest_Regressor": RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
        "Gradient_Boosting_Regressor": GradientBoostingRegressor(n_estimators=120, learning_rate=0.08, max_depth=4, random_state=42)
    }
    
    best_name = None
    best_pipeline = None
    best_metrics = None
    best_r2 = -float("inf")
    results = {}
    
    print("\n[-] Comparing Regression Models:")
    for name, regressor in candidates.items():
        pipe = Pipeline(steps=[
            ("preprocessor", build_preprocessor()),
            ("regressor", regressor)
        ])
        
        pipe.fit(train_feat, y_train_reg)
        preds = pipe.predict(test_feat)
        metrics = evaluate_regression(y_test_reg, preds)
        results[name] = metrics
        
        print(f"    * {name:<30} -> R2: {metrics['r2_score']:.4f} | RMSE: {metrics['rmse']:.2f} | MAE: {metrics['mae']:.2f}")
        
        if metrics["r2_score"] > best_r2:
            best_r2 = metrics["r2_score"]
            best_name = name
            best_pipeline = pipe
            best_metrics = metrics
            
    print(f"\n[+] Best Model Selected: {best_name} (R2 = {best_metrics['r2_score']:.4f})")
    
    # 4. Train Risk Classification Model
    print("\n[+] Training Risk Level Classifier (Low / Medium / High)...")
    clf_pipeline = Pipeline(steps=[
        ("preprocessor", build_preprocessor()),
        ("classifier", RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42))
    ])
    clf_pipeline.fit(train_feat, y_train_clf)
    clf_preds = clf_pipeline.predict(test_feat)
    clf_metrics = evaluate_classification(y_test_clf, clf_preds)
    print(f"    * Classifier Accuracy: {clf_metrics['accuracy'] * 100:.2f}%")
    
    # 5. Extract Feature Importance
    preprocessor = best_pipeline.named_steps["preprocessor"]
    model_obj = best_pipeline.named_steps["regressor"]
    feature_names = get_transformed_feature_names(preprocessor)
    importance_list = extract_feature_importance(model_obj, feature_names)
    
    # 6. Save Artifacts
    model_save_path = os.path.join(MODELS_DIR, "best_student_model.joblib")
    clf_save_path = os.path.join(MODELS_DIR, "risk_classifier.joblib")
    preprocessor_save_path = os.path.join(MODELS_DIR, "preprocessor.joblib")
    metrics_save_path = os.path.join(MODELS_DIR, "metrics.json")
    
    joblib.dump(best_pipeline, model_save_path)
    joblib.dump(clf_pipeline, clf_save_path)
    joblib.dump(preprocessor, preprocessor_save_path)
    
    metadata = {
        "timestamp": datetime.now().isoformat(),
        "best_model_name": best_name,
        "regression_metrics": best_metrics,
        "classification_accuracy": clf_metrics["accuracy"],
        "all_model_results": results,
        "top_features": importance_list[:8],
        "training_samples": len(train_df),
        "test_samples": len(test_df)
    }
    
    with open(metrics_save_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"\n[+] Saved artifacts successfully to {MODELS_DIR}:")
    print(f"    - {os.path.basename(model_save_path)}")
    print(f"    - {os.path.basename(clf_save_path)}")
    print(f"    - {os.path.basename(preprocessor_save_path)}")
    print(f"    - {os.path.basename(metrics_save_path)}")
    print("=" * 60)
    print("[+] Training Pipeline Complete!")
    print("=" * 60)
    
    return metadata

if __name__ == "__main__":
    run_training()
