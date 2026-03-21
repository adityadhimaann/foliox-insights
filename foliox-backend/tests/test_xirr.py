import pytest
from datetime import date
from app.services.xirr import xirr, calculate_portfolio_xirr

class TestXirr:
    
    def test_basic_positive_return(self, sample_cashflows):
        """Standard SIP cashflows should return ~16% XIRR."""
        result = xirr(sample_cashflows)
        assert 0.10 < result < 0.25, f"Expected ~16%, got {result*100:.1f}%"
    
    def test_all_positive_returns_zero(self):
        """If all cashflows are positive, XIRR should be 0."""
        cf = [(date(2021,1,1), 1000), (date(2021,6,1), 2000)]
        assert xirr(cf) == 0.0
    
    def test_all_negative_returns_zero(self):
        """If all cashflows are negative (no redemption), XIRR = 0."""
        cf = [(date(2021,1,1), -1000), (date(2021,6,1), -2000)]
        assert xirr(cf) == 0.0
    
    def test_single_cashflow_returns_zero(self):
        cf = [(date(2021,1,1), -50000)]
        assert xirr(cf) == 0.0
    
    def test_empty_cashflows_returns_zero(self):
        assert xirr([]) == 0.0
    
    def test_loss_scenario(self):
        """Portfolio worth less than invested should give negative XIRR."""
        cf = [
            (date(2021,1,1), -100000.0),
            (date(2022,1,1),  80000.0),
        ]
        result = xirr(cf)
        assert result < 0, "Loss scenario should give negative XIRR"
    
    def test_high_return_scenario(self):
        """2x return in 5 years ~ 14.87% CAGR."""
        cf = [
            (date(2020,1,1), -100000.0),
            (date(2025,1,1),  200000.0),
        ]
        result = xirr(cf)
        assert 0.13 < result < 0.17
    
    def test_portfolio_xirr_uses_current_value(self):
        transactions = [
            (date(2021,1,1), -50000.0),
            (date(2021,7,1), -50000.0),
        ]
        result = calculate_portfolio_xirr(transactions, 120000.0, date(2022,1,1))
        assert result > 0
