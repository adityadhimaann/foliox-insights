from typing import List, Dict
from app.utils.amfi import classify_fund_category

# Curated holdings map for common Indian funds (hackathon-grade data)
FUND_HOLDINGS_MAP = {
    "mirae asset large cap": [
        "Reliance Industries", "HDFC Bank", "Infosys", "ICICI Bank", "TCS",
        "Larsen & Toubro", "Kotak Mahindra Bank", "Axis Bank", "Bajaj Finance",
        "HUL",
    ],
    "axis bluechip": [
        "Bajaj Finance", "HDFC Bank", "ICICI Bank", "TCS", "Infosys",
        "Kotak Mahindra Bank", "Avenue Supermarts", "Asian Paints", "HUL",
        "Maruti Suzuki",
    ],
    "parag parikh flexi cap": [
        "HDFC Bank", "Coal India", "ITC", "Power Grid", "Bajaj Holdings",
        "Alphabet", "Microsoft", "Meta Platforms", "Amazon", "Markel Corp",
    ],
    "sbi small cap": [
        "Tube Investments", "Chola Finance", "Elgi Equipments", "JK Cement",
        "Hawkins Cookers", "Birlasoft", "Anant Raj", "PCBL", "V-Guard",
        "Safari Industries",
    ],
    "hdfc mid-cap opportunities": [
        "Cholamandalam Finance", "Persistent Systems", "Supreme Industries",
        "Coforge", "Alkem Laboratories", "Trent", "Cummins India",
        "Mphasis", "Dixon Technologies", "Astral",
    ],
}

def get_holdings_for_fund(fund_name: str) -> List[str]:
    """Match fund name to holdings using fuzzy key matching."""
    fund_lower = fund_name.lower()
    for key, holdings in FUND_HOLDINGS_MAP.items():
        if all(word in fund_lower for word in key.split() if len(word) > 3):
            return holdings
    
    # Fallback by category
    category = classify_fund_category(fund_name)
    fallback = {
        "Large Cap": ["HDFC Bank", "Reliance Industries", "Infosys", 
                      "ICICI Bank", "TCS"],
        "Mid Cap": ["Cholamandalam Finance", "Persistent Systems", 
                    "Supreme Industries", "Coforge", "Dixon Technologies"],
        "Small Cap": ["Tube Investments", "Elgi Equipments", "JK Cement",
                      "Birlasoft", "Anant Raj"],
        "ELSS": ["HDFC Bank", "Infosys", "ICICI Bank", "Reliance Industries",
                 "Larsen & Toubro"],
    }
    return fallback.get(category, ["HDFC Bank", "Infosys", "ICICI Bank"])

def calculate_overlap(holdings_a: List[str], holdings_b: List[str]) -> float:
    """Calculate % overlap between two funds' top holdings."""
    if not holdings_a or not holdings_b:
        return 0.0
    set_a = set(holdings_a)
    set_b = set(holdings_b)
    intersection = set_a & set_b
    if not set_a: return 0.0
    # Percentage of Fund A that is also in Fund B
    return round(len(intersection) / len(set_a) * 100, 1)

def build_overlap_matrix(funds: List[Dict]) -> List[Dict]:
    """Build pairwise overlap matrix for all funds."""
    holdings_map = {}
    for fund in funds:
        holdings_map[fund["fund_name"]] = get_holdings_for_fund(
            fund["fund_name"]
        )
    
    pairs = []
    fund_names = [f["fund_name"] for f in funds]
    
    for i in range(len(fund_names)):
        for j in range(i + 1, len(fund_names)):
            name_a = fund_names[i]
            name_b = fund_names[j]
            holdings_a = holdings_map[name_a]
            holdings_b = holdings_map[name_b]
            
            overlap_pct = calculate_overlap(holdings_a, holdings_b)
            common = list(set(holdings_a) & set(holdings_b))
            
            pairs.append({
                "fund_a": name_a,
                "fund_b": name_b,
                "overlap_percentage": overlap_pct,
                "common_stocks": common,
            })
    
    return sorted(pairs, key=lambda x: x["overlap_percentage"], reverse=True)
