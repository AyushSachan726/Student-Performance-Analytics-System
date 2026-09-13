"""
Evaluation & Metrics Module
Computes regression and classification metrics for trained student models.
"""

from typing import Dict, Any, List
import numpy as np
from sklearn.metrics import (
    r2_score,
    mean_squared_error,
    mean_absolute_error,
    explained_variance_score,
    accuracy_score,
    classification_report
)

def evaluate_regression(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Calculate standard regression performance metrics."""
    mse = mean_squared_error(y_true, y_pred)
    rmse = float(np.sqrt(mse))
    mae = float(mean_absolute_error(y_true, y_pred))
    r2 = float(r2_score(y_true, y_pred))
    ev = float(explained_variance_score(y_true, y_pred))
    
    return {
        "r2_score": round(r2, 4),
        "rmse": round(rmse, 4),
        "mae": round(mae, 4),
        "explained_variance": round(ev, 4)
    }

def evaluate_classification(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, Any]:
    """Calculate classification accuracy and detailed report."""
    acc = float(accuracy_score(y_true, y_pred))
    report = classification_report(y_true, y_pred, output_dict=True)
    return {
        "accuracy": round(acc, 4),
        "report": report
    }

def extract_feature_importance(model: Any, feature_names: List[str]) -> List[Dict[str, Any]]:
    """Extract and sort feature importance or coefficients from model."""
    importances = []
    if hasattr(model, "feature_importances_"):
        raw_imp = model.feature_importances_
        for name, val in zip(feature_names, raw_imp):
            importances.append({"feature": name, "importance": round(float(val), 4)})
    elif hasattr(model, "coef_"):
        raw_coef = np.abs(model.coef_)
        if raw_coef.ndim > 1:
            raw_coef = raw_coef.mean(axis=0)
        for name, val in zip(feature_names, raw_coef):
            importances.append({"feature": name, "importance": round(float(val), 4)})
            
    importances.sort(key=lambda x: x["importance"], reverse=True)
    return importances
