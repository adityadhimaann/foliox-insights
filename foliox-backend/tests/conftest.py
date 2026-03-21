import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from datetime import date
from main import app

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"

@pytest_asyncio.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as c:
        yield c

@pytest.fixture
def sample_cashflows():
    """Sample cashflows for XIRR testing."""
    return [
        (date(2021, 1, 1),  -50000.0),
        (date(2021, 4, 1),   -5000.0),
        (date(2021, 7, 1),   -5000.0),
        (date(2021, 10, 1),  -5000.0),
        (date(2022, 1, 1),   -5000.0),
        (date(2022, 6, 1),   80000.0),
    ]

@pytest.fixture
def sample_portfolio():
    """Minimal portfolio dict for health score / expense tests."""
    return {
        "total_invested": 500000,
        "total_current_value": 680000,
        "portfolio_xirr": 0.114,
        "benchmark_xirr": 0.132,
        "funds": [
            {"fund_name": "Mirae Asset Large Cap Fund",
             "category": "Large Cap", "xirr": 0.112,
             "current_value": 302000, "expense_ratio": 0.018,
             "is_direct_plan": False},
            {"fund_name": "Parag Parikh Flexi Cap Fund",
             "category": "Flexi Cap", "xirr": 0.143,
             "current_value": 378000, "expense_ratio": 0.015,
             "is_direct_plan": False},
        ],
        "overlap_pairs": [
            {"fund_a": "Mirae", "fund_b": "Parag", "overlap_percentage": 22.0}
        ],
    }
