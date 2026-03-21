import httpx
from typing import Optional, List

MFAPI_BASE = "https://api.mfapi.in/mf"

async def get_fund_top_holdings(scheme_code: str) -> List[str]:
    """
    Fetch top holdings for a fund (Curated fallback).
    In production, use Morningstar or Value Research API.
    """
    CATEGORY_HOLDINGS = {
        "Large Cap": [
            "Reliance Industries", "HDFC Bank", "Infosys", "ICICI Bank",
            "TCS", "Larsen & Toubro", "Kotak Mahindra Bank", "Axis Bank",
            "Bajaj Finance", "HUL", "Wipro", "Maruti Suzuki",
        ],
        "Mid Cap": [
            "Cholamandalam Finance", "Persistent Systems", "Tube Investments",
            "Supreme Industries", "Dixon Technologies", "Astral", "Alkem Labs",
            "Mphasis", "Coforge", "Voltas", "KPIT Technologies", "Oberoi Realty",
        ],
        "Small Cap": [
            "Elecon Engineering", "JK Cement", "Birlasoft", "Anant Raj",
            "PCBL", "Suven Pharmaceuticals", "Craftsman Automation",
            "Latent View Analytics", "Newgen Software", "Rategain Travel",
        ],
    }
    return CATEGORY_HOLDINGS.get("Large Cap", [])

async def get_nav_history(
    scheme_code: str, 
    limit_days: int = 365
) -> List[dict]:
    """Fetch NAV history for a scheme."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{MFAPI_BASE}/{scheme_code}")
            response.raise_for_status()
            data = response.json()
            return data.get("data", [])[:limit_days]
    except Exception:
        return []
