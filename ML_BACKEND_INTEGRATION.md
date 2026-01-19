# ML Backend Integration

## Overview
The Next.js frontend now connects to your FastAPI ML backend for real virality predictions using your trained `.pkl` models.

## Architecture

```
User Input (Dashboard) 
    ↓
Next.js API Route (/api/analyze)
    ↓
FastAPI ML Backend (http://localhost:8000/analyze)
    ↓
.pkl Models (virality prediction)
    ↓
Response → Database → User
```

## Files Modified

### 1. API Route (`src/app/api/analyze/route.ts`)
- Calls FastAPI backend at `http://localhost:8000/analyze`
- Sends `{ text: string, num_comments: number }`
- Receives `{ virality_probability: number, verdict: string }`
- Converts probability (0-1) to score (0-100)
- Generates contextual insights based on verdict (High/Medium/Low)
- Saves to database with all metrics

### 2. Dashboard (`src/app/dashboard/page.tsx`)
- Added "Number of Comments" input field
- Sends both content and numComments to API
- Shows ML Backend error if backend is down (503 status)
- Updated loading state: "Analyzing with ML Model..."

### 3. API Utility (`src/lib/api.ts`)
- Clean TypeScript interfaces for ML backend
- `analyzePost(text, numComments)` function
- Proper error handling with `MLBackendError` class
- Health check function for backend status

### 4. Environment Variables
- Added `ML_BACKEND_URL=http://localhost:8000` to `.env.local`
- Documented in `.env.example`

## How It Works

### Request Flow
1. User enters content and optional comment count
2. Frontend calls `/api/analyze` with content + numComments
3. Next.js API route calls FastAPI: `POST http://localhost:8000/analyze`
4. FastAPI loads `.pkl` models and predicts virality
5. Returns `virality_probability` (0-1) and `verdict` ("High"/"Medium"/"Low")
6. Next.js converts to multi-dimensional scores (overall, emotional, shareability, etc.)
7. Generates insights based on verdict
8. Saves to SQLite database
9. Returns to frontend for display

### Response Mapping

**FastAPI Response:**
```json
{
  "virality_probability": 0.73,
  "verdict": "High"
}
```

**Converted to Frontend Format:**
```json
{
  "score": {
    "overall": 73,
    "emotionalImpact": 75,
    "shareability": 68,
    "timing": 70,
    "uniqueness": 65,
    "engagement": 77
  },
  "insights": ["Strong viral potential detected by ML model", ...],
  "recommendations": ["Post at peak times", ...]
}
```

## Running the Stack

### 1. Start ML Backend (FastAPI)
```bash
cd ml-backend
python -m uvicorn main:app --reload --port 8000
```

### 2. Start Next.js Frontend
```bash
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:3000
- ML Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Error Handling

### Backend Down
If ML backend is unavailable:
- Returns 503 status
- Shows user-friendly error: "ML backend is unavailable. Please ensure it's running at http://localhost:8000"

### Invalid Input
- Empty content: 400 error
- Missing authentication: 401 redirect to login

### Network Errors
- Timeout after 30 seconds
- Displays: "Failed to analyze content. Please try again."

## Testing

### Test ML Backend
```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This is amazing!", "num_comments": 10}'
```

Expected response:
```json
{
  "virality_probability": 0.82,
  "verdict": "High"
}
```

### Test Full Stack
1. Sign in at http://localhost:3000/login
2. Go to Dashboard
3. Paste content: "This AI breakthrough changes everything!"
4. Enter comments: 25
5. Click "Analyze Now"
6. Should see ML-based scores and insights

## Insights Generated

### High Verdict (≥70% probability)
- "Strong viral potential detected by ML model"
- "Content shows high engagement probability"
- "Optimal characteristics for social media spread"

### Medium Verdict (40-70%)
- "Moderate viral potential identified"
- "Content has decent engagement probability"
- "Some improvements could boost virality"

### Low Verdict (<40%)
- "Lower viral potential according to ML analysis"
- "Content may need optimization for better reach"
- "Consider revising core messaging"

## Database Storage

All ML predictions are saved to SQLite:
```sql
Analysis {
  userId: string
  content: string (first 500 chars)
  overall: int (ML probability * 100)
  emotionalImpact: int (varied)
  shareability: int (varied)
  timing: int (varied)
  uniqueness: int (varied)
  engagement: int (varied)
  insights: JSON
  recommendations: JSON
  createdAt: DateTime
}
```

## Production Deployment

### Environment Variables
Set in production:
```env
ML_BACKEND_URL=https://your-ml-backend.com
```

### CORS Configuration
Ensure FastAPI allows requests from your frontend domain:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.com"],
    allow_methods=["POST"],
    allow_headers=["*"],
)
```

## Troubleshooting

### "ML backend is unavailable"
✓ Check if FastAPI is running: `curl http://localhost:8000/health`
✓ Verify port 8000 is not blocked
✓ Check `ML_BACKEND_URL` in `.env.local`

### "Analysis failed"
✓ Check FastAPI logs for errors
✓ Verify `.pkl` models are loaded correctly
✓ Test backend directly with curl

### Wrong Scores
✓ Verify FastAPI returns probability between 0-1
✓ Check verdict is one of: "High", "Medium", "Low"
✓ Examine Next.js API logs

## API Reference

### POST /api/analyze
**Request:**
```typescript
{
  content: string;      // Required
  numComments?: number; // Optional, defaults to 0
}
```

**Response:**
```typescript
{
  content: string;
  score: {
    overall: number;        // ML probability * 100
    emotionalImpact: number;
    shareability: number;
    timing: number;
    uniqueness: number;
    engagement: number;
  };
  insights: string[];
  recommendations: string[];
  timestamp: Date;
}
```

**Errors:**
- 401: Unauthorized (not signed in)
- 400: Bad request (empty content)
- 503: ML backend unavailable
- 500: Internal server error

## Future Enhancements

- [ ] Batch analysis support
- [ ] Real-time ML model updates
- [ ] A/B testing different models
- [ ] Confidence intervals
- [ ] Explainability features (SHAP values)
- [ ] Model performance metrics dashboard
- [ ] Caching frequent predictions
- [ ] Rate limiting
