import pytest
from app.services.health_score import calculate_health_score

class TestHealthScore:
    
    def _score(self, **kwargs):
        defaults = dict(
            portfolio_xirr=0.114,
            benchmark_xirr=0.132,
            overlap_pairs=[],
            weighted_expense_ratio=0.018,
            num_funds=4,
            has_sip=True,
            categories={"Large Cap": 0.5, "Flexi Cap": 0.5},
        )
        defaults.update(kwargs)
        return calculate_health_score(**defaults)
    
    def test_total_score_within_range(self):
        result = self._score()
        assert 0 <= result["total_score"] <= 100
    
    def test_subscores_sum_to_total(self):
        result = self._score()
        sub_sum = (result["returns_score"] + result["diversification_score"] +
                   result["cost_efficiency_score"] + result["consistency_score"])
        assert abs(sub_sum - result["total_score"]) < 0.1
    
    def test_beating_benchmark_improves_returns_score(self):
        lagging  = self._score(portfolio_xirr=0.08,  benchmark_xirr=0.132)
        beating  = self._score(portfolio_xirr=0.165, benchmark_xirr=0.132)
        assert beating["returns_score"] > lagging["returns_score"]
    
    def test_high_overlap_reduces_diversification(self):
        no_overlap  = self._score(overlap_pairs=[])
        high_overlap = self._score(overlap_pairs=[
            {"overlap_percentage": 65},
            {"overlap_percentage": 70},
            {"overlap_percentage": 58},
        ])
        assert no_overlap["diversification_score"] > high_overlap["diversification_score"]
    
    def test_direct_plan_improves_cost_score(self):
        regular = self._score(weighted_expense_ratio=0.020)
        direct  = self._score(weighted_expense_ratio=0.005)
        assert direct["cost_efficiency_score"] > regular["cost_efficiency_score"]
    
    def test_sip_investor_scores_higher_consistency(self):
        sip_investor    = self._score(has_sip=True)
        lump_sum_only   = self._score(has_sip=False)
        assert sip_investor["consistency_score"] > lump_sum_only["consistency_score"]
    
    def test_too_many_funds_reduces_diversification(self):
        optimal = self._score(num_funds=4)
        too_many = self._score(num_funds=18)
        assert optimal["diversification_score"] >= too_many["diversification_score"]
