import modal
from fastapi import UploadFile, File
from pypdf import PdfReader
import io

# =====================================================
# Modal App
# =====================================================
app = modal.App("oversight-ai")

# =====================================================
# Container Image
# =====================================================
image = modal.Image.debian_slim().pip_install(
    "fastapi[standard]",
    "openai",
    "pypdf"
)

# =====================================================
# OpenAI Secret (created in Modal dashboard)
# =====================================================
openai_secret = modal.Secret.from_name("openai-secret")


# =====================================================
# Health Check
# =====================================================
@app.function(image=image)
@modal.fastapi_endpoint(method="GET")
def health():
    return {"status": "Oversight AI running ✅"}


# =====================================================
# GPT Medical Bill Analyzer
# =====================================================
@app.function(
    image=image,
    secrets=[openai_secret],
)
def analyze_bill_text(text: str):

    from openai import OpenAI
    import json

    # ✅ API key automatically injected from Modal Secret
    client = OpenAI()

    prompt = f"""
You are an expert US medical billing auditor.

Analyze this medical bill and detect:

- overpriced procedures
- duplicate charges
- suspicious facility fees
- upcoding
- billing anomalies

Return STRICT JSON ONLY:

{{
  "flags": ["issue1", "issue2"],
  "summary": "short explanation"
}}

Medical Bill:
{text[:6000]}
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        temperature=0.2,
        messages=[
            {"role": "user", "content": prompt}
        ],
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except Exception:
        return {
            "flags": ["AI parsing issue"],
            "summary": content[:300],
        }


# =====================================================
# JSON Text Endpoint (optional)
# =====================================================
@app.function(
    image=image,
    secrets=[openai_secret],
)
@modal.fastapi_endpoint(method="POST")
def analyze_bill(data: dict):

    bill_text = data.get("bill_text", "")

    result = analyze_bill_text.remote(bill_text)

    return result


# =====================================================
# PDF Upload + AI Analysis Endpoint
# =====================================================
@app.function(
    image=image,
    secrets=[openai_secret],
)
@modal.fastapi_endpoint(method="POST")
async def analyze_pdf(file: UploadFile = File(...)):

    # -------------------------
    # Read uploaded PDF
    # -------------------------
    contents = await file.read()

    pdf = PdfReader(io.BytesIO(contents))

    extracted_text = ""

    for page in pdf.pages:
        extracted_text += page.extract_text() or ""

    if not extracted_text.strip():
        return {
            "flags": ["No readable text found"],
            "summary": "PDF may be scanned or image-based."
        }

    # -------------------------
    # Send to GPT Analysis
    # -------------------------
    result = analyze_bill_text.remote(extracted_text)

    return {
        "extracted_preview": extracted_text[:500],
        **result
    }