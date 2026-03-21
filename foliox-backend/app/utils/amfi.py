import httpx
from typing import Dict, Optional
from app.services.cache import cache
from app.utils.logger import get_logger

log = get_logger(__name__)

# AMFI URL
AMFI_NAV_URL = "https://portal.amfiindia.com/spages/NAVAll.txt"

# In-memory backup
_amfi_cache: Dict[str, dict] = {}

async def fetch_amfi_data() -> Dict[str, dict]:
    """Fetch all AMFI NAVs and parse into a dictionary."""
    async with httpx.AsyncClient(timeout=30.0, follow_redirects=True) as client:
        response = await client.get(AMFI_NAV_URL)
        response.raise_for_status()
    
    funds = {}
    for line in response.text.split('\n'):
        parts = line.strip().split(';')
        if len(parts) >= 6:
            try:
                scheme_code = parts[0].strip()
                isin_div = parts[1].strip()
                isin_growth = parts[2].strip()
                scheme_name = parts[3].strip()
                nav_str = parts[4].strip()
                nav = float(nav_str) if nav_str and nav_str != 'N.A.' else 0.0
                nav_date = parts[5].strip()
                
                entry = {
                    "scheme_code": scheme_code,
                    "scheme_name": scheme_name,
                    "isin_growth": isin_growth,
                    "isin_div": isin_div,
                    "nav": nav,
                    "nav_date": nav_date,
                }
                
                # Key by ISIN for discovery
                if isin_growth and len(isin_growth) == 12:
                    funds[isin_growth] = entry
                if isin_div and len(isin_div) == 12:
                    funds[isin_div] = entry
                
                # Also key by scheme code
                funds[scheme_code] = entry
            except (ValueError, IndexError):
                continue
    
    return funds

async def warm_amfi_cache():
    """Warms the cache at startup, checking Redis first."""
    global _amfi_cache
    try:
        cached = await cache.get_amfi_cache()
        if cached:
            _amfi_cache = cached
            log.info("amfi_cache_restored", funds=len(_amfi_cache))
            return

        data = await fetch_amfi_data()
        _amfi_cache = data
        await cache.cache_amfi_data(data)
        log.info("amfi_cache_warmed", funds=len(_amfi_cache))
    except Exception as e:
        log.error("amfi_cache_warm_failed", error=str(e))

def get_nav_by_isin(isin: str) -> Optional[float]:
    entry = _amfi_cache.get(isin)
    return entry["nav"] if entry else None

def get_scheme_by_isin(isin: str) -> Optional[dict]:
    return _amfi_cache.get(isin)

def classify_fund_category(scheme_name: str) -> str:
    name_lower = scheme_name.lower()
    if "elss" in name_lower or "tax saver" in name_lower or "tax plan" in name_lower:
        return "ELSS"
    elif "liquid" in name_lower or "overnight" in name_lower:
        return "Liquid"
    elif "small cap" in name_lower or "smallcap" in name_lower:
        return "Small Cap"
    elif "mid cap" in name_lower or "midcap" in name_lower:
        return "Mid Cap"
    elif "large cap" in name_lower or "largecap" in name_lower or "bluechip" in name_lower:
        return "Large Cap"
    elif "flexi" in name_lower or "multi cap" in name_lower or "multicap" in name_lower:
        return "Flexi Cap"
    elif "international" in name_lower or "global" in name_lower or "overseas" in name_lower or "world" in name_lower:
        return "International"
    elif "debt" in name_lower or "bond" in name_lower or "gilt" in name_lower or "short term" in name_lower:
        return "Debt"
    elif "hybrid" in name_lower or "balanced" in name_lower or "arbitrage" in name_lower:
        return "Hybrid"
    elif "index" in name_lower or "nifty" in name_lower or "sensex" in name_lower:
        return "Index"
    else:
        return "Diversified Equity"

def is_direct_plan(scheme_name: str) -> bool:
    return "direct" in scheme_name.lower()

def get_typical_expense_ratio(category: str, is_direct: bool) -> float:
    regular_ratios = {
        "Large Cap": 0.018,
        "Mid Cap": 0.021,
        "Small Cap": 0.024,
        "Flexi Cap": 0.019,
        "ELSS": 0.020,
        "Index": 0.003,
        "International": 0.012,
        "Debt": 0.008,
        "Liquid": 0.003,
        "Hybrid": 0.017,
        "Diversified Equity": 0.020,
    }
    ratio = regular_ratios.get(category, 0.018)
    return ratio * 0.45 if is_direct else ratio
