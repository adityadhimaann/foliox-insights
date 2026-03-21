def calculate_health_score(
    portfolio_xirr: float,
    benchmark_xirr: float,
    overlap_pairs: list,
    weighted_expense_ratio: float,
    num_funds: int,
    has_sip: bool,
    categories: dict,
) -> dict:
    """
    Calculate Portfolio Health Score out of 100.
    Weighted Breakdown: 30 + 25 + 25 + 20
    """
    # 1. RETURNS SCORE (out of 30)
    alpha = portfolio_xirr - benchmark_xirr
    if alpha >= 0.03: returns_score = 30.0
    elif alpha >= 0.01: returns_score = 25.0
    elif alpha >= 0: returns_score = 20.0
    elif alpha >= -0.02: returns_score = 14.0
    elif alpha >= -0.05: returns_score = 8.0
    else: returns_score = 2.0
    
    # 2. DIVERSIFICATION SCORE (out of 25)
    # High overlap penalty
    high_overlap_pairs = [p for p in overlap_pairs if p["overlap_percentage"] > 50]
    overlap_penalty = min(len(high_overlap_pairs) * 4, 15)
    
    # Fund count score
    if 3 <= num_funds <= 7: fund_count_score = 10
    elif num_funds < 3: fund_count_score = 5
    else: fund_count_score = 6 # diworsification if too many
    
    # Category diversity bonus
    has_intl = any("International" in c for c in categories)
    has_debt = any("Debt" in c or "Liquid" in c for c in categories)
    category_bonus = (3 if has_intl else 0) + (2 if has_debt else 0)
    
    diversification_score = max(0, fund_count_score + category_bonus - overlap_penalty + 5)
    diversification_score = min(float(diversification_score), 25.0)
    
    # 3. COST EFFICIENCY SCORE (out of 25)
    if weighted_expense_ratio <= 0.005: cost_score = 25.0
    elif weighted_expense_ratio <= 0.010: cost_score = 22.0
    elif weighted_expense_ratio <= 0.015: cost_score = 17.0
    elif weighted_expense_ratio <= 0.020: cost_score = 12.0
    elif weighted_expense_ratio <= 0.025: cost_score = 7.0
    else: cost_score = 3.0
    
    # 4. CONSISTENCY SCORE (out of 20)
    sip_bonus = 12 if has_sip else 5
    consistency_score = min(float(sip_bonus + 8), 20.0)
    
    total = returns_score + diversification_score + cost_score + consistency_score
    
    return {
        "returns_score": round(float(returns_score), 1),
        "diversification_score": round(float(diversification_score), 1),
        "cost_efficiency_score": round(float(cost_score), 1),
        "consistency_score": round(float(consistency_score), 1),
        "total_score": round(min(float(total), 100.0), 1),
    }
