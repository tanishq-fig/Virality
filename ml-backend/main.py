from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import numpy as np
from scipy.sparse import hstack

app = FastAPI(title="Virality Prediction API")

# CORS - allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://192.168.29.45:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models at startup
vectorizer = None
model = None

print("Loading models...")
try:
    # Try loading from parent directory first
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    vectorizer_path = os.path.join(parent_dir, "tfidf_vectorizer.pkl")
    model_path = os.path.join(parent_dir, "virality_model.pkl")
    
    print(f"Loading from: {parent_dir}")
    print(f"Vectorizer path: {vectorizer_path}")
    print(f"Model path: {model_path}")
    
    import warnings
    warnings.filterwarnings('ignore')
    
    vectorizer = joblib.load(vectorizer_path)
    print(f"✓ Vectorizer loaded: {type(vectorizer)}")
    
    model = joblib.load(model_path)
    print(f"✓ Model loaded: {type(model)}")
    
    print(f"✓ All models loaded successfully from {parent_dir}")
except Exception as e:
    print(f"X Error loading models: {e}")
    print("Make sure tfidf_vectorizer.pkl and virality_model.pkl are in the project root")
    import traceback
    traceback.print_exc()

class AnalyzeRequest(BaseModel):
    text: str
    num_comments: int = 0

class AnalyzeResponse(BaseModel):
    virality_probability: float
    verdict: str

@app.get("/")
def root():
    return {
        "message": "Virality Prediction API", 
        "status": "running",
        "models_loaded": vectorizer is not None and model is not None
    }

@app.get("/health")
def health():
    if vectorizer and model:
        return {"status": "healthy", "models": "loaded"}
    return {"status": "unhealthy", "models": "not loaded"}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    if not vectorizer or not model:
        raise HTTPException(status_code=500, detail="Models not loaded")
    
    try:
        # Transform text using TF-IDF vectorizer
        text_features = vectorizer.transform([request.text])
        
        # Add num_comments as an additional feature
        # Convert num_comments to a 2D array with shape (1, 1)
        num_comments_feature = np.array([[request.num_comments]], dtype=np.float64)
        
        # Combine text features (sparse) with num_comments (dense)
        # Using hstack to horizontally stack sparse and dense arrays
        combined_features = hstack([text_features, num_comments_feature])
        
        # Predict probability
        try:
            # Try predict_proba first (for classifiers)
            probabilities = model.predict_proba(combined_features)[0]
            # Get probability of positive class (viral)
            probability = probabilities[1] if len(probabilities) > 1 else probabilities[0]
        except AttributeError:
            # If predict_proba doesn't exist, use predict
            prediction = model.predict(combined_features)[0]
            probability = float(prediction)
        
        # Ensure probability is between 0 and 1
        probability = max(0.0, min(1.0, float(probability)))
        
        # Determine verdict
        if probability >= 0.7:
            verdict = "High"
        elif probability >= 0.4:
            verdict = "Medium"
        else:
            verdict = "Low"
        
        print(f"Analysis: text='{request.text[:50]}...', comments={request.num_comments}, prob={probability:.3f}, verdict={verdict}")
        
        return AnalyzeResponse(
            virality_probability=probability,
            verdict=verdict
        )
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("\nStarting FastAPI server...")
    print("Server will be available at: http://localhost:8000")
    print("API docs at: http://localhost:8000/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)
