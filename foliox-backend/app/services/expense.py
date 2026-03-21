def calculate_expense_drag(
    corpus: float,
    weighted_expense_ratio: float,
    xirr: float,
    years: int = 10,
) -> dict:
    """
    Calculate Rupee cost of expense ratios.
    Compares against industry avg direct plan (0.9%).
    """
    direct_plan_er = 0.009  # 0.9%
    
    # Growth with current expense ratio baked in
    corpus_current = corpus * (1 + xirr) ** years
    
    # Growth if transitioned to direct (approximate)
    direct_growth_rate = xirr + (weighted_expense_ratio - direct_plan_er)
    corpus_direct = corpus * (1 + direct_growth_rate) ** years
    
    # Drag calculation
    annual_drag = corpus * (weighted_expense_ratio - direct_plan_er)
    ten_year_drag = corpus_direct - corpus_current
    
    return {
        "weighted_avg_expense_ratio": round(float(weighted_expense_ratio), 4),
        "category_avg_expense_ratio": direct_plan_er,
        "annual_drag_rupees": round(float(annual_drag), 2),
        "ten_year_drag_rupees": round(max(float(ten_year_drag), 0.0), 2),
        "corpus_if_direct_10yr": round(float(corpus_direct), 2),
        "corpus_current_plan_10yr": round(float(corpus_current), 2),
    }
