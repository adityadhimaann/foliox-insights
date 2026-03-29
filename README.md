# FolioX: AI-Powered Portfolio Insights 🚀

**FolioX** is a production-hardened portfolio analysis engine designed for the modern Indian investor. It transforms complex Consolidated Account Statements (CAS) into actionable, AI-driven insights, helping investors optimize returns, minimize costs, and eliminate redundancy.

## 🌟 Key Features

- **Automated PDF Parsing**: Seamlessly extract transaction history from CAMS and KFintech CAS statements.
- **Deep Performance Analytics**: Real-time XIRR calculation and Benchmark (Nifty 50/100) Alpha tracking.
- **Redundancy Detection**: Visual fund overlap matrix to identify 'hidden' concentration risks.
- **Cost Efficiency Audit**: Analysis of expense ratios and 'Direct vs Regular' plan drag.
- **AI Action Plan**: Personalized recommendations powered by LLMs (Claude 3.5 Sonnet) to rebalance your portfolio.
- **Professional PDF Reports**: Backend-generated executive summaries for offline review.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18, Vite
- **Styling**: TailwindCSS, Shadcn UI
- **Animations**: Framer Motion
- **Charts**: Recharts

### Backend
- **Engine**: FastAPI (Python 3.12+)
- **Parser**: pdfplumber
- **Math & Analytics**: NumPy, SciPy (XIRR optimization via Brentq)
- **AI Integration**: Anthropic API (Claude)
- **Reporting**: ReportLab
- **Infrastructure**: Redis (Caching), MongoDB (Persistence), SSE (Real-time Streaming)

## 🚀 Getting Started

1. **Clone the repo**: `git clone https://github.com/adityadhimaann/foliox-insights`
2. **Backend Setup**:
   ```bash
   cd foliox-backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
3. **Frontend Setup**:
   ```bash
   npm install
   npm run dev
   ```

## 🛡️ Privacy & Security
FolioX processes statements locally in your session. Data is never stored permanently unless explicitly saved by the user.

---
Built for the **ET AI Hackathon 2026**.
