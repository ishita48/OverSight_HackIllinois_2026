import modal
from fastapi import UploadFile, File
from pypdf import PdfReader
import io

# -----------------------------
# Modal App
# -----------------------------
app = modal.App("oversight-ai")

# -----------------------------
# Container Image
# -----------------------------
image = modal.Image.debian_slim().pip_install(
    "fastapi[standard]",
    "openai",
    "requests",
    "pypdf"
)

# -----------------------------
# Health Endpoint
# -----------------------------
@app.function(image=image)
@modal.fastapi_endpoint(method="GET")
def health():
    return {"status": "Oversight AI running"}


# -----------------------------
# Text Bill Analysis
# -----------------------------
@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
def analyze_bill(data: dict):

    bill_text = data.get("bill_text", "")

    return {
        "received_text": bill_text,
        "flags": [
            "MRI scan overpriced",
            "Duplicate laboratory fee detected"
        ],
        "summary": "Potential billing issues detected."
    }


# -----------------------------
# PDF Upload + Analysis
# -----------------------------
@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
async def analyze_pdf(file: UploadFile = File(...)):
    
    # Read uploaded PDF
    contents = await file.read()

    pdf = PdfReader(io.BytesIO(contents))

    extracted_text = ""
    for page in pdf.pages:
        extracted_text += page.extract_text() or ""

    # ---- placeholder analysis ----
    flags = [
        "MRI scan priced above national average",
        "Possible duplicate laboratory fee"
    ]

    return {
        "extracted_text_preview": extracted_text[:500],
        "flags": flags,
        "summary": "Potential billing issues detected."
    }