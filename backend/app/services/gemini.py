import google.generativeai as genai
from google.generativeai.types import HarmBlockThreshold, HarmCategory
import json

from app.core.config import settings

genai.configure(api_key=settings.gemini_api_key)

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "category": {
            "type": "string",
            "enum": [
                "smieci", "graffiti", "dziura_w_drodze", "uszkodzona_infrastruktura",
                "zanieczyszczenie_wody", "zanieczyszczenie_powietrza", "niebezpieczne_drzewo", "inne"
            ],
        },
        "description": {"type": "string"},
        "threat_level": {"type": "integer"},
        "suggested_service": {
            "type": "string",
            "enum": ["straz_miejska", "sanepid", "straz_pozarna", "zarzad_drog", "wodociagi", "inne"],
        },
    },
    "required": ["title", "category", "description", "threat_level", "suggested_service"],
}

model = genai.GenerativeModel(
    "models/gemini-2.5-flash",
    generation_config=genai.GenerationConfig(
        response_mime_type="application/json",
        response_schema=RESPONSE_SCHEMA,
    ),
)

PROMPT = "Jesteś asystentem analizującym zdjęcia problemów środowiskowych w Warszawie. Przeanalizuj zdjęcie i wypełnij strukturę JSON."


async def analyze_image(image_data: bytes, content_type: str) -> dict:
    response = model.generate_content(
        [PROMPT, {"mime_type": content_type, "data": image_data}],
        safety_settings={
            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
        },
    )
    return json.loads(response.text)
