from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv
from typing import Optional, List
import json
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Environment variables with defaults
API_KEY = os.getenv('HYPERBOLIC_API_KEY')
if not API_KEY:
    raise ValueError("HYPERBOLIC_API_KEY environment variable is not set")

# Server configuration
PORT = int(os.getenv('PORT', '8000'))
HOST = os.getenv('HOST', '0.0.0.0')

# CORS configuration
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'https://e-zbay-front.vercel.app,http://localhost:5173').split(',')

# Model configuration
DEFAULT_MODEL = os.getenv('DEFAULT_MODEL', 'meta-llama/Meta-Llama-3.1-8B-Instruct')
LARGE_MODEL = os.getenv('LARGE_MODEL', 'meta-llama/Llama-3.3-70B-Instruct')

logger.info(f"API Key loaded: {API_KEY[:10]}...")
logger.info(f"Allowed origins: {ALLOWED_ORIGINS}")

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

@app.get("/")
async def health_check():
    return JSONResponse({
        "status": "ok",
        "message": "API is running",
        "config": {
            "allowed_origins": ALLOWED_ORIGINS,
            "default_model": DEFAULT_MODEL,
            "large_model": LARGE_MODEL
        }
    })

@app.options("/api/generate-listing")
async def options_generate_listing():
    return JSONResponse({"status": "ok"})

@app.exception_handler(404)
async def not_found_handler(request: Request, exc: HTTPException):
    logger.error(f"404 Not Found: {request.url}")
    return JSONResponse(
        status_code=404,
        content={"detail": f"Endpoint {request.url} not found"}
    )

@app.exception_handler(500)
async def internal_error_handler(request: Request, exc: HTTPException):
    logger.error(f"500 Internal Server Error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)}
    )

class ListingRequest(BaseModel):
    itemName: str
    ean: Optional[str] = None
    mpn: Optional[str] = None
    rrp: Optional[str] = None
    useLargeModel: bool = True
    grade: str

def get_condition_description(grade: str) -> str:
    """Convert grade to plain English condition description."""
    conditions = {
        'A': 'Mint/New',
        'B': 'Good Condition with Light Wear',
        'C': 'Used',
        'F': 'Non-Working'
    }
    return conditions.get(grade, 'Used')

@app.post("/api/generate-listing")
async def generate_listing(request: ListingRequest):
    try:
        logger.info(f"Received request for item: {request.itemName}")
        logger.info(f"Grade: {request.grade}")
        
        # Validate grade
        valid_grades = ['A', 'B', 'C', 'F']
        if request.grade not in valid_grades:
            raise HTTPException(status_code=400, detail=f"Invalid grade. Must be one of: {', '.join(valid_grades)}")
        
        # Get condition description and modify item name
        condition = get_condition_description(request.grade)
        modified_item_name = f"{condition} {request.itemName}"
        
        # Prepare the prompt for the Llama model
        prompt = f"""Create an eBay listing following this exact format structure:

**Title:** [Your title here]

**Description:**

[Your main description here - 2-3 paragraphs]

**Key Features and Specifications:**

* [Feature 1]
* [Feature 2]
* [Feature 3]
* [Feature 4]
* [Feature 5]
* [Feature 6]
* [Feature 7]
* [Feature 8]

**Condition:**

[Detailed condition description]

**Shipping:**

[Shipping details]

**Return Policy:**

[Return policy details]

**Keywords:** [Comma-separated keywords]

Note: Please ensure to include high-quality photos of the item from multiple angles to showcase its condition and details.

Item Name: {modified_item_name}
{f'RRP: £{request.rrp}' if request.rrp else ''}"""

        if request.ean:
            prompt += f"\nEAN: {request.ean}"
        if request.mpn:
            prompt += f"\nMPN: {request.mpn}"

        # Configure model parameters based on selection
        model_config = {
            "model": LARGE_MODEL if request.useLargeModel else DEFAULT_MODEL,
            "max_tokens": 512 if request.useLargeModel else 2048,
            "temperature": 0.1,  # Lower temperature for more consistent output
            "top_p": 0.1,  # Lower top_p for more focused output
            "frequency_penalty": 0.5,  # Add frequency penalty to reduce repetition
            "presence_penalty": 0.5  # Add presence penalty to encourage diversity
        }

        # Prepare the request payload
        payload = {
            **model_config,
            "messages": [
                {
                    "role": "system", 
                    "content": "You are an expert eBay listing creator. Create detailed, SEO-optimized listings that accurately describe the item's features and specifications. The item's condition is indicated in the item name - please reflect this condition accurately in the title and description. IMPORTANT: Start your response directly with the title (marked with **Title:**) - do not include any introductory text, phrases like 'Here is a professional eBay listing description', or any other text before the title."
                },
                {"role": "user", "content": prompt}
            ]
        }

        logger.info(f"Using model: {model_config['model']}")
        logger.debug(f"Request payload: {json.dumps(payload, indent=2)}")

        # Call Hyperbolic API
        async with httpx.AsyncClient() as client:
            try:
                logger.info("Sending request to Hyperbolic API...")
                response = await client.post(
                    "https://api.hyperbolic.xyz/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json=payload,
                    timeout=30.0
                )
                
                logger.info(f"Response status code: {response.status_code}")
                logger.debug(f"Response headers: {response.headers}")
                logger.debug(f"Response body: {response.text}")

                if response.status_code != 200:
                    error_detail = response.text
                    logger.error(f"API Error: {error_detail}")
                    raise HTTPException(
                        status_code=response.status_code,
                        detail=f"API Error: {error_detail}"
                    )

                data = response.json()
                if "choices" not in data or not data["choices"]:
                    logger.error(f"Unexpected API response: {json.dumps(data, indent=2)}")
                    raise HTTPException(status_code=500, detail="No response from API")

                # Get the generated listing
                listing_content = data["choices"][0]["message"]["content"]
                
                # Remove any introductory text before the title
                if "**Title:**" in listing_content:
                    listing_content = listing_content[listing_content.index("**Title:**"):]
                
                # Add grade to title if not present
                if not listing_content.lower().startswith(f"grade {request.grade.lower()}"):
                    lines = listing_content.split('\n')
                    for i, line in enumerate(lines):
                        if line.startswith('**Title:**'):
                            lines[i] = f'**Title:** Grade {request.grade} - {line.replace("**Title:**", "").strip()}'
                            break
                    listing_content = '\n'.join(lines)

                logger.info("Successfully generated listing")
                return {"listing": listing_content}

            except httpx.TimeoutException as e:
                logger.error(f"Request timed out: {str(e)}")
                raise HTTPException(status_code=504, detail="Request timed out")
            except httpx.RequestError as e:
                logger.error(f"Request Error: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Request Error: {str(e)}")

    except Exception as e:
        logger.error(f"General Error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT, log_level="debug") 