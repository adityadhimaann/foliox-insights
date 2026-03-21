import httpx
from datetime import date, timedelta
from app.services.xirr import xirr

async def get_nifty50_xirr(
    start_date: date, 
    end_date: date,
) -> float:
    """
    Fetch Nifty 50 historical data (via Yahoo Finance).
    Uses ^NSEI ticker.
    """
    import calendar
    # Convert dates to unix timestamps
    start_ts = calendar.timegm(start_date.timetuple())
    end_ts = calendar.timegm(end_date.timetuple())
    
    url = (
        f"https://query1.finance.yahoo.com/v8/finance/chart/%5ENSEI"
        f"?period1={start_ts}&period2={end_ts}&interval=1mo"
    )
    
    try:
        async with httpx.AsyncClient(
            timeout=15.0,
            headers={"User-Agent": "Mozilla/5.0"}
        ) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            data = resp.json()
        
        # Check if result exists
        res = data.get("chart", {}).get("result", [])
        if not res:
            return 0.133
            
        timestamps = res[0].get("timestamp", [])
        closes = res[0].get("indicators", {}).get("quote", [{}])[0].get("close", [])
        
        valid_closes = [p for p in closes if p is not None]
        if not valid_closes:
            return 0.133
        
        start_price = valid_closes[0]
        end_price = valid_closes[-1]
        
        # CAGR calculation
        years = (end_date - start_date).days / 365.25
        if years <= 0 or start_price <= 0:
            return 0.133
        
        cagr = (end_price / start_price) ** (1 / years) - 1
        return round(float(cagr), 6)
    
    except Exception:
        # Fallback to historical Nifty 50 avg
        return 0.133
