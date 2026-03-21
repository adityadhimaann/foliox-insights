from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import date

class Transaction(BaseModel):
    date: date
    description: str
    amount: float           # negative = purchase, positive = redemption
    nav: float
    units: float
    balance_units: float

class FundHolding(BaseModel):
    fund_name: str
    isin: str
    scheme_code: Optional[str]
    category: str           # Large Cap, Mid Cap, ELSS, etc.
    amc: str
    transactions: List[Transaction]
    current_nav: float
    total_units: float
    current_value: float
    invested_amount: float
    xirr: float             # as decimal, e.g. 0.114 = 11.4%
    expense_ratio: float    # as decimal
    is_direct_plan: bool

class OverlapPair(BaseModel):
    fund_a: str
    fund_b: str
    overlap_percentage: float
    common_stocks: List[str]

class BenchmarkComparison(BaseModel):
    benchmark_name: str     # "Nifty 50" or "Sensex"
    benchmark_xirr: float
    portfolio_xirr: float
    outperforming: bool
    alpha: float            # portfolio_xirr - benchmark_xirr

class HealthScoreBreakdown(BaseModel):
    returns_score: float    # out of 30
    diversification_score: float   # out of 25
    cost_efficiency_score: float   # out of 25
    consistency_score: float       # out of 20
    total_score: float      # out of 100

class ExpenseDrag(BaseModel):
    weighted_avg_expense_ratio: float
    category_avg_expense_ratio: float   # 0.009 for direct
    annual_drag_rupees: float
    ten_year_drag_rupees: float
    corpus_if_direct_10yr: float
    corpus_current_plan_10yr: float

class AIRecommendation(BaseModel):
    priority: str           # "high" | "medium" | "consider"
    action: str             # Short action title
    detail: str             # Full explanation
    estimated_impact: Optional[str]  # "Saves ₹12,400/year"

class TimelinePoint(BaseModel):
    year: int
    invested_amount: float
    portfolio_value: float

class PortfolioAnalysis(BaseModel):
    session_id: str
    investor_name: Optional[str]
    language: str           # "en" | "hi"
    total_invested: float
    total_current_value: float
    total_xirr: float
    funds: List[FundHolding]
    overlap_matrix: List[OverlapPair]
    benchmark: BenchmarkComparison
    health_score: HealthScoreBreakdown
    expense_drag: ExpenseDrag
    ai_recommendations: List[AIRecommendation]
    timeline: List[TimelinePoint]
    fund_categories_breakdown: Dict  # {"Large Cap": 45.2, "Mid Cap": 30.1}
    analysis_timestamp: str
