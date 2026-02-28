import modal
import json

# -----------------------------------
# Modal App
# -----------------------------------
app = modal.App("oversight-ai")

# -----------------------------------
# Container Image
# -----------------------------------
image = (
    modal.Image.debian_slim()
    .pip_install(
        "pdfplumber",
        "openai",
        "httpx",
        "fastapi[standard]",
    )
)

# -----------------------------------
# Core Analysis Function
# -----------------------------------
@app.function(
    image=image,
    timeout=300,
    secrets=[modal.Secret.from_name("openai-secret")],
)
def analyze_bill(pdf_bytes: bytes, user_context: dict = {}):
    import io
    import pdfplumber
    from openai import OpenAI
    import json

    client = OpenAI()

    # ── Step 1: Extract PDF Text ──
    extracted_text = ""
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                extracted_text += text + "\n"

    if not extracted_text.strip():
        return json.dumps({
            "error": "Could not extract text from PDF. Please ensure the PDF is not scanned/image-only.",
            "status": "failed"
        })

    # ── Step 2: Extract structured line items ──
    extraction_response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {
                "role": "system",
                "content": """You are a medical billing extraction AI.

Extract ALL billing information into this STRICT JSON format:

{
  "provider": "Hospital/Clinic name",
  "patient_name": "if visible",
  "date_of_service": "YYYY-MM-DD or null",
  "facility_type": "Emergency Room | Urgent Care | Hospital | Outpatient | Clinic | Lab | Other",
  "total_bill": 0.00,
  "insurance_paid": 0.00,
  "patient_responsibility": 0.00,
  "line_items": [
    {
      "cpt_code": "12345 or null",
      "description": "service description",
      "quantity": 1,
      "unit_price": 0.00,
      "total_price": 0.00,
      "category": "Facility Fee | Professional Fee | Lab | Imaging | Medication | Procedure | Other"
    }
  ]
}

Return ONLY valid JSON. No markdown. No explanation."""
            },
            {
                "role": "user",
                "content": f"Medical bill text:\n\n{extracted_text[:12000]}"
            }
        ],
        response_format={"type": "json_object"},
    )

    structured_bill = json.loads(extraction_response.choices[0].message.content)

    # ── Step 3: Anomaly Detection + Analysis ──
    context_str = ""
    if user_context:
        context_str = f"\n\nAdditional patient context: {json.dumps(user_context)}"

    analysis_response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {
                "role": "system",
                "content": """You are a senior medical billing advocate with 20 years of experience detecting overcharges.

Analyze this structured medical bill and return STRICT JSON:

{
  "risk_score": 0-100,
  "risk_level": "Low | Medium | High | Critical",
  "estimated_overcharge": 0.00,
  "estimated_savings": 0.00,
  "issues": [
    {
      "type": "Upcoding | Duplicate Charge | Above Benchmark | Network Error | Unbundling | Phantom Charge | Other",
      "severity": "Low | Medium | High | Critical",
      "line_item_description": "which charge",
      "billed_amount": 0.00,
      "benchmark_amount": 0.00,
      "overcharge_amount": 0.00,
      "explanation": "clear patient-friendly explanation of the issue",
      "action": "what the patient should do"
    }
  ],
  "benchmarks": [
    {
      "service": "service name",
      "billed": 0.00,
      "national_avg": 0.00,
      "regional_avg": 0.00,
      "percentile": "what percentile this charge falls in"
    }
  ],
  "dispute_letter_needed": true,
  "summary": "2-3 sentence plain English summary for the patient",
  "next_steps": ["step 1", "step 2", "step 3"]
}

Be aggressive in finding issues. Medical bills have errors in 80% of cases.
Return ONLY valid JSON. No markdown."""
            },
            {
                "role": "user",
                "content": f"Structured bill:\n{json.dumps(structured_bill, indent=2)}{context_str}"
            }
        ],
        response_format={"type": "json_object"},
    )

    analysis = json.loads(analysis_response.choices[0].message.content)

    # ── Step 4: Generate Dispute Letter ──
    dispute_letter = None
    if analysis.get("dispute_letter_needed") and analysis.get("issues"):
        letter_response = client.chat.completions.create(
            model="gpt-4.1",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional medical billing advocate. Write a formal dispute letter."
                },
                {
                    "role": "user",
                    "content": f"""Write a formal medical bill dispute letter based on this analysis.

Provider: {structured_bill.get('provider', 'Healthcare Provider')}
Total Bill: ${structured_bill.get('total_bill', 0)}
Issues Found: {json.dumps(analysis.get('issues', []), indent=2)}

Format as a professional letter with:
- Date placeholder [DATE]
- Patient name placeholder [PATIENT NAME]  
- Patient address placeholder [ADDRESS]
- Clear itemized dispute for each issue
- Request for itemized bill review
- 30-day response deadline
- Professional closing

Keep it firm but professional."""
                }
            ],
        )
        dispute_letter = letter_response.choices[0].message.content

    # ── Step 5: Combine Final Result ──
    return json.dumps({
        "status": "success",
        "extracted_bill": structured_bill,
        "analysis": analysis,
        "dispute_letter": dispute_letter,
        "raw_text_length": len(extracted_text),
    })


# -----------------------------------
# Supermemory Integration (optional)
# -----------------------------------
@app.function(
    image=image,
    secrets=[modal.Secret.from_name("openai-secret")],
)
def store_to_supermemory(analysis_result: dict, user_id: str, supermemory_key: str):
    """Store analysis results in Supermemory for longitudinal tracking."""
    import httpx

    content = f"""
Medical Bill Analysis for user {user_id}:
Provider: {analysis_result.get('extracted_bill', {}).get('provider')}
Total Bill: ${analysis_result.get('extracted_bill', {}).get('total_bill')}
Risk Score: {analysis_result.get('analysis', {}).get('risk_score')}
Estimated Overcharge: ${analysis_result.get('analysis', {}).get('estimated_overcharge')}
Issues: {', '.join([i['type'] for i in analysis_result.get('analysis', {}).get('issues', [])])}
Summary: {analysis_result.get('analysis', {}).get('summary')}
"""

    response = httpx.post(
        "https://api.supermemory.ai/memories",
        headers={
            "Authorization": f"Bearer {supermemory_key}",
            "Content-Type": "application/json",
        },
        json={
            "content": content,
            "metadata": {
                "user_id": user_id,
                "type": "medical_bill_analysis",
                "provider": analysis_result.get("extracted_bill", {}).get("provider"),
            },
        },
        timeout=10,
    )
    return response.status_code == 200


# -----------------------------------
# Web Endpoint — POST /analyze
# -----------------------------------
@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
async def analyze(request):
    import json

    body = await request.body()

    # Support both raw PDF bytes and JSON wrapper
    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        data = json.loads(body)
        pdf_bytes = bytes.fromhex(data.get("pdf_hex", ""))
        user_context = data.get("user_context", {})
    else:
        # Raw PDF bytes
        pdf_bytes = body
        user_context = {}

    if not pdf_bytes:
        return {"status": "error", "message": "No PDF data received"}

    result_str = analyze_bill.remote(pdf_bytes, user_context)
    result = json.loads(result_str)

    return result


# -----------------------------------
# Health Check — GET /health
# -----------------------------------
@app.function(image=image)
@modal.fastapi_endpoint(method="GET")
def health():
    return {"status": "ok", "service": "oversight-ai"}