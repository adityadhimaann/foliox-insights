import anthropic
import json
from app.config import settings
from app.utils.logger import get_logger

log = get_logger(__name__)
client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

HINDI_SYSTEM = """
You are a financial translator. Translate the given English mutual fund 
advice into natural Hindi (Devanagari script). 

Rules:
- Keep financial terms like "XIRR", "NAV", "SIP", "ELSS" in English
- Keep rupee amounts as-is (Rs. 12,400)
- Keep fund names in English
- Use simple, everyday Hindi that a retail investor understands
- Do NOT use overly formal or bookish Hindi
- Translate only the "action" and "detail" fields
- Return ONLY the translated JSON array, nothing else

Example good translation:
  English: "Switch to direct plan to save on expense ratio"
  Hindi:   "Direct plan mein switch karein aur expense ratio bachayein"
"""

async def translate_recommendations_to_hindi(recommendations: list) -> list:
    """Translate AI recommendations from English to Hindi."""
    if not recommendations or not settings.ANTHROPIC_API_KEY:
        return recommendations
    
    try:
        log.info("translating_to_hindi", count=len(recommendations))
        message = client.messages.create(
            model="claude-3-5-sonnet-20240620",
            max_tokens=1500,
            system=HINDI_SYSTEM,
            messages=[{
                "role": "user",
                "content": (
                    "Translate these recommendations to Hindi. "
                    "Return ONLY the JSON array, no other text:\n\n"
                    + json.dumps(recommendations, ensure_ascii=False)
                )
            }]
        )
        
        response_text = message.content[0].text.strip()
        # Clean up potential markdown formatting
        if response_text.startswith("```"):
            response_text = re.sub(r'```(?:json)?\n(.*?)\n```', r'\1', response_text, flags=re.DOTALL)
        
        translated = json.loads(response_text.strip())
        return translated
    except Exception as e:
        log.error("translation_failed", error=str(e))
        return recommendations  # fallback to English
