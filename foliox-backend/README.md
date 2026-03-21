# FolioX Backend — AI-powered MF Portfolio X-Ray

Submission for ET AI Hackathon 2026.

## Setup
1. `pip install -r requirements.txt`
2. Set your `ANTHROPIC_API_KEY` in `.env`
3. Run: `uvicorn main:app --reload --port 8000`

## API Endpoints
- `POST /api/upload`: Upload statement PDF
- `POST /api/analyze`: Analyze using session ID
- `GET /api/health`: Check API status
