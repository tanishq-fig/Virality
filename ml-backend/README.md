# ML Backend

FastAPI server for virality prediction using the trained models.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

Server will start at: http://localhost:8000

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /analyze` - Analyze content
- `GET /docs` - Interactive API documentation

## Models

The API loads models from the parent directory:
- `tfidf_vectorizer.pkl` - TF-IDF vectorizer
- `virality_model.pkl` - Trained prediction model
