// app/api/analyze-bill/route.js
import { NextResponse } from "next/server";

const MODAL_URL = process.env.MODAL_ANALYZE_URL;
const SUPERMEMORY_KEY = process.env.SUPERMEMORY_KEY;

async function storeInSupermemory(analysis, userId) {
  if (!SUPERMEMORY_KEY || !userId) return;

  const content = `
Medical Bill Analysis:
Provider: ${analysis.extracted_bill?.provider}
Date: ${analysis.extracted_bill?.date_of_service}
Total Bill: $${analysis.extracted_bill?.total_bill}
Risk Level: ${analysis.analysis?.risk_level} (Score: ${analysis.analysis?.risk_score}/100)
Estimated Overcharge: $${analysis.analysis?.estimated_overcharge}
Issues Found: ${analysis.analysis?.issues?.map((i) => i.type).join(", ")}
Summary: ${analysis.analysis?.summary}
`.trim();

  try {
    await fetch("https://api.supermemory.ai/memories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPERMEMORY_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        metadata: {
          user_id: userId,
          type: "medical_bill_analysis",
          provider: analysis.extracted_bill?.provider,
          risk_score: analysis.analysis?.risk_score,
          timestamp: new Date().toISOString(),
        },
      }),
    });
  } catch (err) {
    console.error("[Supermemory] Failed to store:", err);
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const userId = formData.get("user_id");
    const userContextRaw = formData.get("user_context");

    // ✅ Validate upload
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.name?.endsWith(".pdf")) {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Max 10MB." },
        { status: 400 }
      );
    }

    if (!MODAL_URL) {
      return NextResponse.json(
        { error: "Analysis service not configured. Add MODAL_ANALYZE_URL to .env.local" },
        { status: 500 }
      );
    }

    // ✅ Convert PDF to buffer
    const buffer = await file.arrayBuffer();
    const pdfHex = Buffer.from(buffer).toString("hex");

    let userContext = {};
    if (userContextRaw) {
      try { userContext = JSON.parse(userContextRaw); } catch {}
    }

    // ✅ Send PDF → Modal backend
    const response = await fetch(MODAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pdf_hex: pdfHex, user_context: userContext }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Modal] Error:", errText);
      return NextResponse.json(
        { error: "Analysis service error. Please try again." },
        { status: 502 }
      );
    }

    const result = await response.json();

    if (result.status !== "success") {
      return NextResponse.json(
        { error: result.error || "Analysis failed" },
        { status: 500 }
      );
    }

    // ✅ Store in Supermemory (non-blocking)
    if (userId) {
      storeInSupermemory(result, userId).catch(console.error);
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[analyze-bill] Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}