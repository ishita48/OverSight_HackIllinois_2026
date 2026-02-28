import modal

app = modal.App("oversight-ai")

image = modal.Image.debian_slim().pip_install(
    "requests",
    "openai",
    "fastapi[standard]"
)


@app.function(image=image)
@modal.fastapi_endpoint(method="GET")
def health():
    return {"status": "Oversight AI running"}


@app.function(image=image)
@modal.fastapi_endpoint(method="POST")
def analyze_bill(data: dict):
    return {
        "flags": [
            "MRI scan overpriced",
            "Duplicate lab fee"
        ],
        "summary": "Potential billing issues detected."
    }