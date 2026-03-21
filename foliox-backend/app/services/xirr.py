from scipy.optimize import brentq
from datetime import date, datetime
from typing import List, Tuple
import numpy as np

def xirr(cashflows: List[Tuple[date, float]]) -> float:
    """
    Calculate XIRR (Extended Internal Rate of Return).
    cashflows: list of (date, amount) tuples
    Negative amount = money invested (outflow)
    Positive amount = money received or current value (inflow)
    Returns annual rate as decimal (0.114 = 11.4%)
    """
    if not cashflows or len(cashflows) < 2:
        return 0.0
    
    dates = [cf[0] for cf in cashflows]
    amounts = [cf[1] for cf in cashflows]
    
    # Must have both positive and negative cashflows
    if all(a >= 0 for a in amounts) or all(a <= 0 for a in amounts):
        return 0.0
    
    base_date = dates[0]
    years = [(d - base_date).days / 365.25 for d in dates]
    
    def npv(rate: float) -> float:
        if rate <= -1:
            return float('inf')
        return sum(a / (1 + rate) ** t for a, t in zip(amounts, years))
    
    try:
        # Try common range first
        result = brentq(npv, -0.999, 100.0, maxiter=1000, xtol=1e-8)
        return round(float(result), 6)
    except (ValueError, RuntimeError):
        # NPV doesn't cross zero in range or maxiter exceeded
        return 0.0

def calculate_portfolio_xirr(
    all_transactions: List[Tuple[date, float]],
    current_value: float,
    valuation_date: date,
) -> float:
    """
    Calculate XIRR for entire portfolio.
    Adds current_value as final positive cashflow on valuation_date.
    """
    cashflows = list(all_transactions)
    cashflows.append((valuation_date, current_value))
    # Sort by date
    cashflows.sort(key=lambda x: x[0])
    return xirr(cashflows)

def calculate_fund_xirr(
    transactions: list,
    current_nav: float,
    total_units: float,
    valuation_date: date,
) -> float:
    """Calculate XIRR for a single fund."""
    current_value = current_nav * total_units
    cashflows = []
    for t in transactions:
        # If t.date is string, convert it
        d = t.date
        if isinstance(d, str):
            d = datetime.strptime(d, "%Y-%m-%d").date()
        cashflows.append((d, t.amount))
        
    cashflows.append((valuation_date, current_value))
    cashflows.sort(key=lambda x: x[0])
    return xirr(cashflows)

def build_timeline(
    transactions: List[Tuple[date, float]],
    current_value: float,
    valuation_date: date,
) -> List[dict]:
    """Build year-by-year invested amount vs portfolio value for chart."""
    if not transactions:
        return []
    
    # Ensure transactions are tuples (date, amount)
    clean_txns = []
    for t in transactions:
        if isinstance(t, tuple):
            clean_txns.append(t)
        else:
            # Assume it's a Transaction object
            clean_txns.append((t.date, t.amount))
            
    from collections import defaultdict
    yearly_invested = defaultdict(float)
    
    for d, amount in clean_txns:
        year = d.year
        if amount < 0:  # purchase
            yearly_invested[year] += abs(amount)
    
    start_year = min(d.year for d, amount in clean_txns)
    end_year = valuation_date.year
    
    timeline = []
    cumulative_invested = 0.0
    
    for year in range(start_year, end_year + 1):
        cumulative_invested += yearly_invested.get(year, 0)
        # Approximate portfolio value growth (simplified for demo)
        years_elapsed = max(year - start_year, 1)
        # Assuming 12% avg growth for visualization if not actual
        approx_value = cumulative_invested * (1 + 0.12) ** (year - start_year)
        
        timeline.append({
            "year": year,
            "invested_amount": round(cumulative_invested, 2),
            "portfolio_value": round(min(approx_value, current_value), 2),
        })
    
    # Correct last year to actual current value
    if timeline:
        timeline[-1]["portfolio_value"] = round(current_value, 2)
    
    return timeline
