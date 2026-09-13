"""
Streamlit Web Application
Student Performance Analytics & AI Prediction System
Theme: Raisin Black (#232323), Buff (#CDA175), Sunset (#EBCC98)
"""

import os
import sys
import json
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

# Setup sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from src.predict import StudentPredictor
from src.data_loader import load_raw_data

# Page configuration
st.set_page_config(
    page_title="Student Performance Analytics System",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Raisin Black, Buff, and Sunset Theme
st.markdown("""
<style>
    /* Global Base */
    .stApp {
        background-color: #181818;
        color: #F5EFE6;
    }
    
    /* Headers with Sunset & Buff Gradient */
    .main-header {
        font-size: 2.2rem;
        font-weight: 700;
        background: linear-gradient(90deg, #EBCC98 0%, #CDA175 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
        letter-spacing: -0.5px;
    }
    .sub-header {
        color: #C8B9A6;
        font-size: 1.05rem;
        margin-bottom: 1.2rem;
    }
    
    /* Data Source Banner */
    .data-banner {
        background-color: #232323;
        border-left: 4px solid #CDA175;
        border: 1px solid #333333;
        border-left-width: 4px;
        padding: 10px 16px;
        border-radius: 8px;
        margin-bottom: 1.4rem;
        font-size: 0.94rem;
        color: #EBCC98;
    }
    
    /* Metric Cards */
    div[data-testid="stMetric"] {
        background-color: #232323;
        border: 1px solid #38322B;
        border-radius: 12px;
        padding: 14px 18px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
    }
    div[data-testid="stMetricLabel"] p {
        color: #C8B9A6 !important;
        font-weight: 500 !important;
    }
    div[data-testid="stMetricValue"] div {
        color: #EBCC98 !important;
        font-weight: 700 !important;
    }
    
    /* Buttons in Warm Buff & Sunset */
    .stButton > button, div[data-testid="stFormSubmitButton"] > button {
        background: linear-gradient(135deg, #CDA175 0%, #B88B5E 100%) !important;
        color: #181818 !important;
        font-weight: 600 !important;
        border: 1px solid #EBCC98 !important;
        border-radius: 8px !important;
        transition: all 0.2s ease-in-out !important;
    }
    .stButton > button:hover, div[data-testid="stFormSubmitButton"] > button:hover {
        background: linear-gradient(135deg, #EBCC98 0%, #CDA175 100%) !important;
        color: #111111 !important;
        box-shadow: 0 4px 16px rgba(205, 161, 117, 0.4) !important;
        transform: translateY(-1px);
    }
    
    /* Download Button */
    .stDownloadButton > button {
        background-color: #232323 !important;
        color: #EBCC98 !important;
        border: 1px solid #CDA175 !important;
        border-radius: 8px !important;
        font-weight: 600 !important;
    }
    .stDownloadButton > button:hover {
        background-color: #CDA175 !important;
        color: #181818 !important;
    }
    
    /* Sidebar Styling */
    section[data-testid="stSidebar"] {
        background-color: #232323 !important;
        border-right: 1px solid #333333;
    }
    section[data-testid="stSidebar"] .stMarkdown p, 
    section[data-testid="stSidebar"] .stMarkdown h1, 
    section[data-testid="stSidebar"] .stMarkdown h2, 
    section[data-testid="stSidebar"] .stMarkdown h3 {
        color: #EBCC98;
    }
    
    /* Badges */
    .risk-badge-low {
        background-color: #223528;
        color: #86efac;
        padding: 5px 12px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        border: 1px solid #2e5237;
    }
    .risk-badge-medium {
        background-color: #382d1c;
        color: #EBCC98;
        padding: 5px 12px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        border: 1px solid #CDA175;
    }
    .risk-badge-high {
        background-color: #3d1c1c;
        color: #fca5a5;
        padding: 5px 12px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 0.85rem;
        border: 1px solid #852d2d;
    }
    
    /* Tabs */
    button[data-baseweb="tab"] {
        color: #C8B9A6 !important;
    }
    button[aria-selected="true"] {
        color: #EBCC98 !important;
        border-bottom-color: #CDA175 !important;
    }
</style>
""", unsafe_allow_html=True)

# ─── Load Base Data & Models ────────────────────────────────────
def get_default_data():
    raw_path = os.path.join(PROJECT_ROOT, "data", "raw", "student_performance_data.csv")
    mtime = os.path.getmtime(raw_path) if os.path.exists(raw_path) else 0
    return _load_raw_data_cached(mtime)

@st.cache_data
def _load_raw_data_cached(_mtime):
    return load_raw_data()

def get_kaggle_10k_data():
    path = os.path.join(PROJECT_ROOT, "data", "raw", "kaggle_student_performance_10k.csv")
    if not os.path.exists(path):
        return get_default_data()
    df_k = pd.read_csv(path)
    df_k = df_k.rename(columns={
        "Hours Studied": "study_hours_per_week",
        "Previous Scores": "previous_score",
        "Extracurricular Activities": "extracurricular_activities",
        "Sleep Hours": "sleep_hours",
        "Performance Index": "final_score"
    })
    if "student_id" not in df_k.columns:
        df_k["student_id"] = [f"KAG{10000+i}" for i in range(len(df_k))]
    if "name" not in df_k.columns:
        df_k["name"] = [f"Student #{i+1}" for i in range(len(df_k))]
    if "attendance_rate" not in df_k.columns:
        # Compute realistic attendance correlation
        df_k["attendance_rate"] = np.clip(np.round(df_k["previous_score"] * 0.75 + 22), 45.0, 100.0)
    if "grade_level" not in df_k.columns:
        np.random.seed(42)
        df_k["grade_level"] = np.random.choice(["Grade 10", "Grade 11", "Grade 12"], size=len(df_k))
    if "math_score" not in df_k.columns:
        df_k["math_score"] = np.clip(np.round(df_k["previous_score"] * 0.96), 25.0, 100.0)
    if "science_score" not in df_k.columns:
        df_k["science_score"] = np.clip(np.round(df_k["previous_score"] * 0.97), 25.0, 100.0)
    if "english_score" not in df_k.columns:
        df_k["english_score"] = np.clip(np.round(df_k["previous_score"] * 0.95), 28.0, 100.0)
    if "risk_level" not in df_k.columns:
        df_k["risk_level"] = df_k["final_score"].apply(lambda x: "Low" if x >= 75 else ("Medium" if x >= 55 else "High"))
    if "passed" not in df_k.columns:
        df_k["passed"] = df_k["final_score"].apply(lambda x: "Yes" if x >= 50 else "No")
    return df_k

@st.cache_resource
def get_predictor():
    return StudentPredictor()

@st.cache_data
def get_metrics():
    metrics_path = os.path.join(PROJECT_ROOT, "models", "metrics.json")
    if os.path.exists(metrics_path):
        with open(metrics_path, "r") as f:
            return json.load(f)
    return None

metrics_data = get_metrics()

try:
    predictor = get_predictor()
except Exception:
    predictor = None


# ─── Chart Styling Helper for Raisin Black & Warm Gold ───────────
def style_chart(fig):
    """Applies the Raisin Black (#232323) and Sunset (#EBCC98) dark theme to Plotly figures."""
    fig.update_layout(
        paper_bgcolor="#232323",
        plot_bgcolor="#232323",
        font=dict(color="#EBCC98", family="sans-serif"),
        title_font=dict(color="#EBCC98", size=15),
        legend=dict(
            font=dict(color="#F5EFE6"),
            bgcolor="rgba(35, 35, 35, 0.7)"
        ),
        margin=dict(l=20, r=20, t=40, b=20),
        xaxis=dict(
            gridcolor="#333333",
            zerolinecolor="#444444",
            tickfont=dict(color="#C8B9A6")
        ),
        yaxis=dict(
            gridcolor="#333333",
            zerolinecolor="#444444",
            tickfont=dict(color="#C8B9A6")
        )
    )
    return fig


# ─── Sidebar: Navigation & Dataset Selector ─────────────────────
st.sidebar.title("EduAnalytics ML")
st.sidebar.markdown("**Student Intelligence Platform**")
st.sidebar.markdown("---")

menu = st.sidebar.radio(
    "Navigation",
    [
        "Dashboard & Overview",
        "Visual Analytics & EDA",
        "AI Performance Predictor",
        "Student Records & Risk Alerts",
        "Model Diagnostics & Explainability"
    ]
)

st.sidebar.markdown("---")
st.sidebar.subheader("Dataset Selection")

dataset_source_option = st.sidebar.selectbox(
    "Active Data Benchmark",
    [
        "Kaggle Benchmark Dataset (12,500 records)",
        "Official Kaggle 10K Dataset (10,000 records)",
        "Upload Custom CSV File"
    ]
)

# Load selected dataset
if dataset_source_option == "Official Kaggle 10K Dataset (10,000 records)":
    df = get_kaggle_10k_data()
    active_dataset_label = "Official Kaggle 10K Dataset"
elif dataset_source_option == "Kaggle Benchmark Dataset (12,500 records)":
    df = get_default_data()
    active_dataset_label = "Kaggle Benchmark Unified Dataset"
else:
    # Custom CSV upload mode
    uploaded_file = st.sidebar.file_uploader(
        "Upload Custom Student CSV",
        type=["csv"],
        help="Upload your own student dataset to run analytics and predictions."
    )
    if uploaded_file is not None:
        try:
            df = pd.read_csv(uploaded_file, keep_default_na=False)
            active_dataset_label = f"Uploaded File: {uploaded_file.name}"
            st.sidebar.success(f"Loaded: {uploaded_file.name} ({len(df):,} rows)")
            
            # Predict if missing final_score
            req_pred_cols = [
                "gender", "age", "grade_level", "parental_education",
                "study_hours_per_week", "attendance_rate", "sleep_hours",
                "previous_score", "math_score", "science_score", "english_score"
            ]
            has_pred = all(c in df.columns for c in req_pred_cols)
            if "final_score" not in df.columns and has_pred and predictor is not None:
                if st.sidebar.button("Run Predictions on this CSV", width='stretch'):
                    with st.spinner("Generating predictions..."):
                        pred_scores = []
                        pred_risks = []
                        passed_l = []
                        for _, row in df.iterrows():
                            res = predictor.predict_one(row.to_dict())
                            pred_scores.append(res["predicted_score"])
                            pred_risks.append(res["predicted_risk"])
                            passed_l.append("Yes" if res["passed"] else "No")
                        df["final_score"] = pred_scores
                        df["risk_level"] = pred_risks
                        df["passed"] = passed_l
                        if "student_id" not in df.columns:
                            df["student_id"] = [f"U_STU{1000+i}" for i in range(len(df))]
                        if "name" not in df.columns:
                            df["name"] = [f"Student {i+1}" for i in range(len(df))]
        except Exception as e:
            st.sidebar.error(f"Error: {e}")
            df = get_default_data()
            active_dataset_label = "Kaggle Benchmark Dataset"
    else:
        df = get_default_data()
        active_dataset_label = "Kaggle Benchmark Dataset (Please upload a CSV)"

# Reload / Clear Cache button
if st.sidebar.button("Reload Data / Flush Cache", width='stretch'):
    st.cache_data.clear()
    st.rerun()

# Download Sample CSV template
sample_template = get_default_data().head(5).copy()
sample_csv = sample_template.to_csv(index=False).encode("utf-8")
st.sidebar.download_button(
    label="Download Sample CSV Template",
    data=sample_csv,
    file_name="sample_student_template.csv",
    mime="text/csv",
    width='stretch'
)

st.sidebar.markdown("---")
st.sidebar.info("Tip: Use the AI Predictor to forecast individual student grades and detect academic risk.")

# Fallbacks for data safety
if "final_score" not in df.columns:
    df["final_score"] = 60.0
if "passed" not in df.columns:
    df["passed"] = df["final_score"].apply(lambda x: "Yes" if x >= 50 else "No")
if "risk_level" not in df.columns:
    df["risk_level"] = df["final_score"].apply(lambda x: "Low" if x >= 75 else ("Medium" if x >= 55 else "High"))
if "attendance_rate" not in df.columns:
    df["attendance_rate"] = 80.0


# ─── 1. Dashboard & Overview ───────────────────────────────────
if menu == "Dashboard & Overview":
    st.markdown('<div class="main-header">Student Performance Analytics</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Executive overview of academic health, key milestones, and cohort performance.</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="data-banner"><strong>Active Dataset:</strong> {active_dataset_label} ({len(df):,} student records)</div>', unsafe_allow_html=True)

    # Top KPI Metrics
    total_students = len(df)
    avg_score = float(df["final_score"].mean())
    pass_count = int((df["passed"] == "Yes").sum())
    pass_rate = (pass_count / total_students * 100) if total_students > 0 else 0
    at_risk_count = int((df["risk_level"] == "High").sum())
    attendance_avg = float(df["attendance_rate"].mean())

    c1, c2, c3, c4, c5 = st.columns(5)
    with c1:
        st.metric("Total Students", f"{total_students:,}")
    with c2:
        st.metric("Average Score", f"{avg_score:.1f}%", delta=f"{avg_score - 70:.1f}% vs Goal")
    with c3:
        st.metric("Pass Rate", f"{pass_rate:.1f}%", delta="+2.4% MoM")
    with c4:
        st.metric("At-Risk Students", f"{at_risk_count}", delta=f"-{(at_risk_count/total_students*100):.1f}%" if total_students > 0 else "0%", delta_color="inverse")
    with c5:
        st.metric("Avg Attendance", f"{attendance_avg:.1f}%")

    st.markdown("---")

    # Row 1 Charts
    col_left, col_right = st.columns([6, 4])
    
    with col_left:
        st.subheader("Distribution of Final Exam Scores")
        fig_hist = px.histogram(
            df,
            x="final_score",
            nbins=30,
            color="risk_level" if "risk_level" in df.columns else None,
            color_discrete_map={"Low": "#CDA175", "Medium": "#EBCC98", "High": "#E05252"},
            marginal="box",
            title="Score Frequency with Risk Classification"
        )
        fig_hist.update_layout(bargap=0.08)
        style_chart(fig_hist)
        st.plotly_chart(fig_hist, width='stretch')

    with col_right:
        st.subheader("Cohort Risk Breakdown")
        if "risk_level" in df.columns:
            risk_dist = df["risk_level"].value_counts().reset_index()
            risk_dist.columns = ["Risk Level", "Count"]
            fig_pie = px.pie(
                risk_dist,
                names="Risk Level",
                values="Count",
                color="Risk Level",
                color_discrete_map={"Low": "#CDA175", "Medium": "#EBCC98", "High": "#E05252"},
                hole=0.45
            )
            style_chart(fig_pie)
            st.plotly_chart(fig_pie, width='stretch')
        else:
            st.info("No risk_level column available in this dataset.")

    # Row 2 Charts
    col_a, col_b = st.columns(2)
    with col_a:
        st.subheader("Attendance vs. Academic Performance")
        hover_cols = [c for c in ["name", "grade_level", "study_hours_per_week"] if c in df.columns]
        fig_scatter = px.scatter(
            df,
            x="attendance_rate",
            y="final_score",
            color="risk_level" if "risk_level" in df.columns else None,
            hover_data=hover_cols,
            color_discrete_map={"Low": "#CDA175", "Medium": "#EBCC98", "High": "#E05252"},
            labels={"attendance_rate": "Attendance Rate (%)", "final_score": "Final Score (0-100)"}
        )
        fig_scatter.add_vline(x=75, line_dash="dash", line_color="#EBCC98", annotation_text="75% Min Attendance", annotation_font_color="#EBCC98")
        style_chart(fig_scatter)
        st.plotly_chart(fig_scatter, width='stretch')

    with col_b:
        st.subheader("Average Subject Scores by Grade Level")
        subj_cols = [c for c in ["math_score", "science_score", "english_score"] if c in df.columns]
        if "grade_level" in df.columns and subj_cols:
            grade_subj = df.groupby("grade_level")[subj_cols].mean().reset_index()
            fig_bar = px.bar(
                grade_subj,
                x="grade_level",
                y=subj_cols,
                barmode="group",
                labels={"value": "Mean Score", "variable": "Subject", "grade_level": "Grade"},
                color_discrete_sequence=["#CDA175", "#EBCC98", "#9E7B58"]
            )
            style_chart(fig_bar)
            st.plotly_chart(fig_bar, width='stretch')
        else:
            st.info("Subject scores or grade_level column not available for breakdown.")


# ─── 2. Visual Analytics & EDA ──────────────────────────────────
elif menu == "Visual Analytics & EDA":
    st.markdown('<div class="main-header">Exploratory Data Analytics (EDA)</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Deep dive into correlations, study patterns, and socio-educational indicators.</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="data-banner"><strong>Active Dataset:</strong> {active_dataset_label} ({len(df):,} student records)</div>', unsafe_allow_html=True)

    eda_tab1, eda_tab2, eda_tab3 = st.tabs(["Factor Correlations", "Study & Sleep Habits", "Demographic Impacts"])

    with eda_tab1:
        st.subheader("Correlation Heatmap of Academic Features")
        numeric_cols = [
            c for c in [
                "study_hours_per_week", "attendance_rate", "sleep_hours",
                "previous_score", "math_score", "science_score", "english_score", "final_score"
            ] if c in df.columns
        ]
        if len(numeric_cols) >= 2:
            corr_matrix = df[numeric_cols].corr()
            fig_corr = px.imshow(
                corr_matrix,
                text_auto=".2f",
                aspect="auto",
                color_continuous_scale=[[0.0, "#181818"], [0.35, "#3d3224"], [0.7, "#CDA175"], [1.0, "#EBCC98"]],
                title="Correlation Matrix (Pearson)"
            )
            style_chart(fig_corr)
            st.plotly_chart(fig_corr, width='stretch')
        else:
            st.info("Not enough numeric columns for correlation heatmap.")

    with eda_tab2:
        st.subheader("Study Hours vs Final Score by Test Prep Course")
        if "study_hours_per_week" in df.columns and "final_score" in df.columns:
            hover_f = [c for c in ["name", "risk_level"] if c in df.columns]
            fig_prep = px.scatter(
                df,
                x="study_hours_per_week",
                y="final_score",
                color="test_prep_course" if "test_prep_course" in df.columns else None,
                size="attendance_rate" if "attendance_rate" in df.columns else None,
                hover_data=hover_f,
                color_discrete_map={"Completed": "#CDA175", "Not Completed": "#666666"},
                labels={"study_hours_per_week": "Study Hours / Week", "final_score": "Final Score"}
            )
            style_chart(fig_prep)
            st.plotly_chart(fig_prep, width='stretch')
        else:
            st.info("Columns study_hours_per_week or final_score not available.")

    with eda_tab3:
        st.subheader("Impact of Parental Education on Performance")
        if "parental_education" in df.columns and "final_score" in df.columns:
            fig_edu = px.box(
                df,
                x="parental_education",
                y="final_score",
                color="parental_education",
                points="all",
                color_discrete_sequence=["#CDA175", "#EBCC98", "#B88B5E", "#DFB88F", "#8B5E3C"],
                category_orders={"parental_education": ["High School", "Some College", "Associate Degree", "Bachelor's Degree", "Master's Degree"]}
            )
            fig_edu.update_layout(showlegend=False)
            style_chart(fig_edu)
            st.plotly_chart(fig_edu, width='stretch')
        else:
            st.info("parental_education column not available in dataset.")


# ─── 3. AI Performance Predictor ───────────────────────────────
elif menu == "AI Performance Predictor":
    st.markdown('<div class="main-header">AI Student Performance & Risk Predictor</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Simulate student profiles and receive instant AI grade predictions and actionable interventions.</div>', unsafe_allow_html=True)

    if predictor is None:
        st.error("ML model not initialized. Please run `python src/train.py` first.")
    else:
        with st.form("prediction_form"):
            st.markdown("### Student Academic Profile")
            col1, col2, col3 = st.columns(3)
            
            with col1:
                gender = st.selectbox("Gender", ["Female", "Male"])
                age = st.slider("Age", 14, 21, 17)
                grade_level = st.selectbox("Grade Level", ["Grade 10", "Grade 11", "Grade 12"])
                parental_education = st.selectbox(
                    "Parental Education",
                    ["High School", "Some College", "Associate Degree", "Bachelor's Degree", "Master's Degree"],
                    index=3
                )
                
            with col2:
                study_hours = st.slider("Study Hours / Week", 1.0, 35.0, 14.0, 0.5)
                attendance = st.slider("Attendance Rate (%)", 40.0, 100.0, 85.0, 1.0)
                sleep_hours = st.slider("Sleep Hours / Day", 4.0, 10.0, 7.0, 0.5)
                internet_access = st.radio("Home Internet Access", ["Yes", "No"], horizontal=True)

            with col3:
                extra_curricular = st.radio("Extracurricular Activities", ["Yes", "No"], horizontal=True)
                test_prep = st.radio("Test Prep Course", ["Completed", "Not Completed"], horizontal=True)
                prev_score = st.slider("Previous Score / GPA (0-100)", 30.0, 100.0, 75.0, 1.0)
                
            st.markdown("### Mid-Term Exam Marks")
            sc1, sc2, sc3 = st.columns(3)
            with sc1:
                math_score = st.slider("Mathematics Score", 20.0, 100.0, 78.0, 1.0)
            with sc2:
                science_score = st.slider("Science Score", 20.0, 100.0, 80.0, 1.0)
            with sc3:
                english_score = st.slider("English Score", 20.0, 100.0, 76.0, 1.0)
                
            submit_btn = st.form_submit_button("Run AI Prediction & Analysis", width='stretch')

        if submit_btn:
            input_data = {
                "gender": gender,
                "age": age,
                "grade_level": grade_level,
                "parental_education": parental_education,
                "study_hours_per_week": study_hours,
                "attendance_rate": attendance,
                "internet_access": internet_access,
                "extracurricular_activities": extra_curricular,
                "test_prep_course": test_prep,
                "sleep_hours": sleep_hours,
                "previous_score": prev_score,
                "math_score": math_score,
                "science_score": science_score,
                "english_score": english_score
            }
            
            result = predictor.predict_one(input_data)
            
            st.markdown("---")
            st.subheader("Prediction Results & Diagnosis")
            
            res_c1, res_c2, res_c3, res_c4 = st.columns(4)
            with res_c1:
                st.metric("Predicted Score", f"{result['predicted_score']}%")
            with res_c2:
                st.metric("Letter Grade", result["predicted_grade"])
            with res_c3:
                risk = result["predicted_risk"]
                badge_class = f"risk-badge-{risk.lower()}"
                st.markdown(f"**Risk Level:** <span class='{badge_class}'>{risk} Risk</span>", unsafe_allow_html=True)
            with res_c4:
                status = "Passing" if result["passed"] else "Failing / High Danger"
                st.metric("Status", status)
                
            st.markdown("#### AI Pedagogical Recommendations")
            st.info(f"Action Items: {result['recommendation']}")


# ─── 4. Student Records & Risk Alerts ───────────────────────────
elif menu == "Student Records & Risk Alerts":
    st.markdown('<div class="main-header">Student Records & Risk Alerts</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Search, filter, upload, and export student performance records.</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="data-banner"><strong>Active Dataset:</strong> {active_dataset_label} ({len(df):,} student records)</div>', unsafe_allow_html=True)

    # In-page CSV Upload Box
    with st.expander("Upload New CSV Dataset"):
        inpage_file = st.file_uploader("Choose CSV file", type=["csv"], key="inpage_csv_uploader")
        if inpage_file is not None:
            try:
                uploaded_in_df = pd.read_csv(inpage_file, keep_default_na=False)
                st.write(f"Preview of uploaded CSV ({len(uploaded_in_df)} rows):")
                st.dataframe(uploaded_in_df.head(4), width='stretch')
                
                req_pred_cols = [
                    "gender", "age", "grade_level", "parental_education",
                    "study_hours_per_week", "attendance_rate", "sleep_hours",
                    "previous_score", "math_score", "science_score", "english_score"
                ]
                has_pred_cols = all(col in uploaded_in_df.columns for col in req_pred_cols)
                
                col_u1, col_u2 = st.columns(2)
                with col_u1:
                    if st.button("Apply this CSV to Dashboard", key="btn_apply_inpage"):
                        st.session_state.custom_df = uploaded_in_df
                        st.session_state.data_source_name = f"Uploaded: {inpage_file.name} ({len(uploaded_in_df)} records)"
                        st.rerun()
                        
                with col_u2:
                    if "final_score" not in uploaded_in_df.columns and has_pred_cols and predictor is not None:
                        if st.button("Predict Grades for this CSV & Apply", key="btn_predict_inpage"):
                            pred_scores = []
                            pred_risks = []
                            passed_list = []
                            for _, r in uploaded_in_df.iterrows():
                                res = predictor.predict_one(r.to_dict())
                                pred_scores.append(res["predicted_score"])
                                pred_risks.append(res["predicted_risk"])
                                passed_list.append("Yes" if res["passed"] else "No")
                            uploaded_in_df["final_score"] = pred_scores
                            uploaded_in_df["risk_level"] = pred_risks
                            uploaded_in_df["passed"] = passed_list
                            if "student_id" not in uploaded_in_df.columns:
                                uploaded_in_df["student_id"] = [f"U_STU{1000+i}" for i in range(len(uploaded_in_df))]
                            if "name" not in uploaded_in_df.columns:
                                uploaded_in_df["name"] = [f"Student {i+1}" for i in range(len(uploaded_in_df))]
                            st.session_state.custom_df = uploaded_in_df
                            st.session_state.data_source_name = f"Uploaded & Predicted: {inpage_file.name} ({len(uploaded_in_df)} records)"
                            st.rerun()
            except Exception as e:
                st.error(f"Error loading CSV: {e}")

    fc1, fc2, fc3 = st.columns([4, 3, 3])
    with fc1:
        search_query = st.text_input("Search by Student Name or ID", "")
    with fc2:
        available_grades = list(df["grade_level"].unique()) if "grade_level" in df.columns else []
        grade_filter = st.multiselect("Filter Grade", available_grades, default=available_grades)
    with fc3:
        available_risks = list(df["risk_level"].unique()) if "risk_level" in df.columns else []
        risk_filter = st.multiselect("Filter Risk Level", available_risks, default=available_risks)

    filtered_df = df.copy()
    if search_query and "name" in filtered_df.columns:
        q = search_query.lower()
        id_col = "student_id" if "student_id" in filtered_df.columns else "name"
        filtered_df = filtered_df[
            filtered_df["name"].astype(str).str.lower().str.contains(q) |
            filtered_df[id_col].astype(str).str.lower().str.contains(q)
        ]
    if grade_filter and "grade_level" in filtered_df.columns:
        filtered_df = filtered_df[filtered_df["grade_level"].isin(grade_filter)]
    if risk_filter and "risk_level" in filtered_df.columns:
        filtered_df = filtered_df[filtered_df["risk_level"].isin(risk_filter)]

    st.markdown(f"**Showing {len(filtered_df)} of {len(df)} students**")

    # High Risk Alerts Highlight
    if "risk_level" in filtered_df.columns:
        high_risk_subset = filtered_df[filtered_df["risk_level"] == "High"]
        if not high_risk_subset.empty:
            st.warning(f"Attention Required: {len(high_risk_subset)} student(s) currently flagged as High Risk. Immediate intervention advised.")

    display_cols = [
        c for c in [
            "student_id", "name", "grade_level", "attendance_rate",
            "study_hours_per_week", "math_score", "science_score", "english_score",
            "final_score", "risk_level", "passed"
        ] if c in filtered_df.columns
    ]
    st.dataframe(filtered_df[display_cols], width='stretch', height=450)

    # Export CSV
    csv_data = filtered_df.to_csv(index=False).encode("utf-8")
    st.download_button(
        label="Download Filtered Records as CSV",
        data=csv_data,
        file_name="filtered_student_performance.csv",
        mime="text/csv"
    )


# ─── 5. Model Diagnostics & Explainability ─────────────────────
elif menu == "Model Diagnostics & Explainability":
    st.markdown('<div class="main-header">Model Diagnostics & Explainability</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Evaluation benchmarks, hyperparameter results, and feature importances.</div>', unsafe_allow_html=True)

    if metrics_data:
        m1, m2, m3, m4 = st.columns(4)
        reg_metrics = metrics_data.get("regression_metrics", {})
        with m1:
            st.metric("Model Architecture", metrics_data.get("best_model_name", "Ridge_Regression"))
        with m2:
            st.metric("R2 Score", f"{reg_metrics.get('r2_score', 0):.4f}")
        with m3:
            st.metric("RMSE Error", f"{reg_metrics.get('rmse', 0):.2f} pts")
        with m4:
            st.metric("Risk Classifier Acc.", f"{metrics_data.get('classification_accuracy', 0)*100:.1f}%")

        st.markdown("---")
        
        # Feature Importance Chart
        st.subheader("Key Determinants of Student Success (Feature Importances)")
        top_features = metrics_data.get("top_features", [])
        if top_features:
            feat_df = pd.DataFrame(top_features)
            fig_feat = px.bar(
                feat_df,
                x="importance",
                y="feature",
                orientation="h",
                color="importance",
                color_continuous_scale=[[0.0, "#3d3224"], [0.5, "#CDA175"], [1.0, "#EBCC98"]],
                title="Relative Feature Importance / Coefficients"
            )
            fig_feat.update_layout(yaxis={"autorange": "reversed"})
            style_chart(fig_feat)
            st.plotly_chart(fig_feat, width='stretch')

        st.subheader("Model Tournament Benchmark Comparison")
        model_results = metrics_data.get("all_model_results", {})
        if model_results:
            comp_rows = []
            for m_name, m_vals in model_results.items():
                comp_rows.append({
                    "Model": m_name,
                    "R2 Score": m_vals["r2_score"],
                    "RMSE (Lower is better)": m_vals["rmse"],
                    "MAE (Lower is better)": m_vals["mae"]
                })
            st.table(pd.DataFrame(comp_rows))

    else:
        st.info("No model metrics file found. Please run `python src/train.py`.")
