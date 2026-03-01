import modal
import io
import json

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

# =====================================================
# Modal App
# =====================================================
app = modal.App("oversight-ai")

# =====================================================
# Container Image
# =====================================================
image = (
    modal.Image.debian_slim()
    .pip_install(
        "fastapi[standard]",
        "openai",
        "pypdf",
        "python-multipart",
    )
)

# =====================================================
# Secrets
# =====================================================
openai_secret = modal.Secret.from_name("openai-secret")

# =====================================================
# FastAPI App
# =====================================================
web_app = FastAPI()

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# GPT BILL ANALYZER (⭐ ENHANCED)
# =====================================================
@app.function(
    image=image,
    secrets=[openai_secret],
    min_containers=1,
)
def analyze_bill_text(text: str):

    from openai import OpenAI

    client = OpenAI()

    prompt = f"""
You are a professional US medical billing auditor.

Identify suspicious or incorrect charges.

Return STRICT JSON ONLY:

{{
  "issues":[
    {{
      "type":"upcoding | duplicate | inflated_cost | unnecessary",
      "item":"name of billed item",
      "cpt_code":"if available",
      "amount":0,
      "fair_price":0,
      "overcharge":0,
      "explanation":"why this is suspicious",
      "severity":"low | medium | high"
    }}
  ],
  "summary":"overall audit summary"
}}

Medical Bill:
{text[:6000]}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        messages=[{"role": "user", "content": prompt}],
    )

    content = response.choices[0].message.content.strip()

    # ✅ Remove markdown wrapping
    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "").strip()

    try:
        return json.loads(content)

    except Exception:
        return {
            "issues": [],
            "summary": content[:400],
        }


# =====================================================
# HEALTH CHECK
# =====================================================
@web_app.get("/")
async def health():
    return {"status": "Oversight AI running ✅"}


# =====================================================
# TEXT ANALYSIS
# =====================================================
@web_app.post("/analyze_bill")
async def analyze_bill(data: dict):

    bill_text = data.get("bill_text", "")
    result = analyze_bill_text.remote(bill_text)

    return result


# =====================================================
# PDF UPLOAD + INLINE DATA
# =====================================================
@web_app.post("/analyze_pdf")
async def analyze_pdf(file: UploadFile = File(...)):

    contents = await file.read()
    pdf = PdfReader(io.BytesIO(contents))

    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text() or ""

    if not extracted_text.strip():
        return {
            "issues": [],
            "summary": "PDF may be scanned or image-based.",
        }

    result = analyze_bill_text.remote(extracted_text)

    return {
        "extracted_text": extracted_text,   # ⭐ enables highlighting
        **result,
    }


# =====================================================
# MODAL ENTRYPOINT
# =====================================================
@app.function(
    image=image,
    secrets=[openai_secret],
    min_containers=1,
)
@modal.asgi_app()
def fastapi_app():
    return web_app