# FastAPI ML Backend Setup Guide

## Quick Start

Your `.pkl` files contain trained models. Here's how to set up the FastAPI backend to serve them.

## File Structure

```
ml-backend/
├── main.py                 # FastAPI application
├── model_loader.py         # Load .pkl models
├── requirements.txt        # Python dependencies
├── vectorizer.pkl         # Your vectorizer model
├── model.pkl              # Your prediction model
└── .env                   # Optional config
```

## 1. Create FastAPI Application

### `ml-backend/main.py`
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np

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
try:
    with open("vectorizer.pkl", "rb") as f:
        vectorizer = pickle.load(f)
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
    print("✓ Models loaded successfully")
except Exception as e:
    print(f"✗ Error loading models: {e}")
    vectorizer = None
    model = None

class AnalyzeRequest(BaseModel):
    text: str
    num_comments: int = 0

class AnalyzeResponse(BaseModel):
    virality_probability: float
    verdict: str

@app.get("/")
def root():
    return {"message": "Virality Prediction API", "status": "running"}

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
        # Transform text using vectorizer
        text_features = vectorizer.transform([request.text])
        
        # Add num_comments as feature if your model uses it
        # Adjust based on your actual model's features
        # If your model only uses text, just use text_features
        
        # Predict probability
        probability = model.predict_proba(text_features)[0][1]  # Assuming binary classification
        
        # Determine verdict
        if probability >= 0.7:
            verdict = "High"
        elif probability >= 0.4:
            verdict = "Medium"
        else:
            verdict = "Low"
        
        return AnalyzeResponse(
            virality_probability=float(probability),
            verdict=verdict
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### If your model uses both text and num_comments:
```python
# Adjust the analyze function:
@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    if not vectorizer or not model:
        raise HTTPException(status_code=500, detail="Models not loaded")
    
    try:
        # Transform text
        text_features = vectorizer.transform([request.text]).toarray()
        
        # Combine with num_comments
        features = np.hstack([text_features, [[request.num_comments]]])
        
        # Predict
        probability = model.predict_proba(features)[0][1]
        
        # Determine verdict
        if probability >= 0.7:
            verdict = "High"
        elif probability >= 0.4:
            verdict = "Medium"
        else:
            verdict = "Low"
        
        return AnalyzeResponse(
            virality_probability=float(probability),
            verdict=verdict
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
```

## 2. Create Requirements

### `ml-backend/requirements.txt`
```
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
numpy==1.24.3
scikit-learn==1.3.2
```

## 3. Install Dependencies

```bash
cd ml-backend
pip install -r requirements.txt
```

Or using virtual environment:
```bash
cd ml-backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

## 4. Place Your .pkl Files

Move your `.pkl` files to the `ml-backend` folder:
```
ml-backend/
├── vectorizer.pkl   ← Your vectorizer
├── model.pkl        ← Your trained model
└── main.py
```

## 5. Run the Backend

```bash
cd ml-backend
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
✓ Models loaded successfully
```

## 6. Test the Backend

### Test Health Endpoint
```bash
curl http://localhost:8000/health
```

Expected:
```json
{"status": "healthy", "models": "loaded"}
```

### Test Analysis
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"This is an amazing breakthrough!\", \"num_comments\": 10}"
```

Expected:
```json
{
  "virality_probability": 0.73,
  "verdict": "High"
}
```

### View API Docs
Open browser: http://localhost:8000/docs

## 7. Connect to Next.js

The Next.js frontend is already configured to call your ML backend!

Just ensure both are running:
- **ML Backend**: http://localhost:8000
- **Next.js**: http://localhost:3000

## Troubleshooting

### "Models not loaded"
✓ Check if `.pkl` files are in `ml-backend/` folder
✓ Verify file names: `vectorizer.pkl` and `model.pkl`
✓ Check Python version compatibility (models may be version-specific)

### "Prediction failed"
✓ Check model input shape matches your training
✓ Verify vectorizer works with your model
✓ Check if num_comments feature is needed

### Port already in use
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:8000 | xargs kill -9
```

### Import errors
```bash
pip install --upgrade scikit-learn numpy
```

## Model Inspection

If you need to check what's inside your `.pkl` files:

```python
import pickle

# Load and inspect
with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)
    print(type(vectorizer))
    print(dir(vectorizer))

with open("model.pkl", "rb") as f:
    model = pickle.load(f)
    print(type(model))
    print(model.get_params())
```

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Using Docker
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables
```env
MODEL_PATH=./model.pkl
VECTORIZER_PATH=./vectorizer.pkl
PORT=8000
```

## Next Steps

1. Start ML backend: `cd ml-backend && python main.py`
2. Start Next.js: `npm run dev`
3. Sign in at http://localhost:3000/login
4. Go to Dashboard and analyze content!

The frontend will automatically call your ML backend and display real predictions.
