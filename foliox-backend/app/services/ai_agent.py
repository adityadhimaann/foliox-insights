import anthropic
import json
from app.config import settings

client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

SYSTEM_PROMPT = """
You are FolioX AI, an expert mutual fund advisor for Indian retail investors.
You analyze portfolio data and provide clear, actionable recommendations.

STRICT RULES:
1. Always mention the specific fund name in recommendations
2. Quantify impact in rupees (₹) wherever possible  
3. Use simple language — no financial jargon
4. Maximum 3 recommendations, ordered by financial impact
5. Always include a disclaimer at the end
6. If language is "hi", respond in Hindi (Devanagari script)
7. If language is "en", respond in English
8. Never make recommendations beyond what the data supports

RESPONSE FORMAT — return ONLY valid JSON, no other text:
{
  "recommendations": [
    {
      "priority": "high" | "medium" | "consider",
      "action": "Short title (max 8 words)",
      "detail": "Full explanation with specific fund names and numbers",
      "estimated_impact": "Saves ₹X/year" or "Improves returns by X%"
    }
  ],
  "summary": "One sentence portfolio summary in chosen language",
  "disclaimer": "Not SEBI-registered advice. For educational purposes only."
}
"""

async def generate_recommendations(
    portfolio_data: dict,
    language: str = "en",
) -> dict:
    """
    Call Claude to generate personalized recommendations.
    Uses calculated metrics.
    """
    if not settings.ANTHROPIC_API_KEY:
        # Fallback if API key missing
        return {
            "recommendations": [
                {
                    "priority": "high",
                    "action": "Switch to direct plans",
                    "detail": "Regular plans charge higher expense ratios. (Set ANTHROPIC_API_KEY for more AI insights)",
                    "estimated_impact": "Saves ~1% annually"
                }
            ],
            "summary": "Portfolio analysis complete.",
            "disclaimer": "Not SEBI-registered advice. For educational purposes only."
        }

    user_message = f"""
Analyze this mutual fund portfolio and give recommendations:

PORTFOLIO SUMMARY:
- Total Invested: ₹{portfolio_data['total_invested']:,.0f}
- Current Value: ₹{portfolio_data['total_current_value']:,.0f}
- Portfolio XIRR: {portfolio_data['portfolio_xirr']*100:.1f}%
- Benchmark (Nifty 50) XIRR: {portfolio_data['benchmark_xirr']*100:.1f}%
- Health Score: {portfolio_data['health_score']}/100
- Language preference: {language}

FUNDS:
{json.dumps([{
    'name': f['fund_name'],
    'category': f['category'],
    'xirr': f'{f["xirr"]*100:.1f}%',
    'value': f'₹{f["current_value"]:,.0f}',
    'expense_ratio': f'{f["expense_ratio"]*100:.2f}%',
    'is_direct': f['is_direct_plan']
} for f in portfolio_data['funds']], indent=2)}

HIGH OVERLAP PAIRS (>40%):
{json.dumps([p for p in portfolio_data['overlap_pairs'] if p['overlap_percentage'] > 40], indent=2)}

EXPENSE ANALYSIS:
- Weighted expense ratio: {portfolio_data['weighted_expense_ratio']*100:.2f}%
- 10-year expense drag: ₹{portfolio_data['ten_year_drag']:,.0f}

Generate exactly 3 recommendations. Prioritize by financial impact.
Return ONLY the JSON object, no markdown, no explanation.
"""
    
    try:
        message = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )
        
        response_text = message.content[0].text.strip()
        
        # Clean response string
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
        response_text = response_text.strip()
        
        return json.loads(response_text)
    except Exception:
        # Generic fallback
        return {
            "recommendations": [
                {
                    "priority": "high",
                    "action": "Switch to direct plans",
                    "detail": "Regular plans charge higher expense ratios than direct plans.",
                    "estimated_impact": "Saves ~1% annually"
                }
            ],
            "summary": "Portfolio analysis complete.",
            "disclaimer": "Not SEBI-registered advice. For educational purposes only."
        }
