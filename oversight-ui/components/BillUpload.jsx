"use client";

import { useState } from "react";
import { analyzeBill } from "@/lib/analyzeBill";

export default function BillUpload() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    // TEMP: simulate extracted text
    const fakeBillText =
      "MRI Scan $4200 Blood Test $900 Consultation $500";

    try {
      const analysis = await analyzeBill(fakeBillText);
      setResult(analysis);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 border rounded-xl">
      <h2 className="text-xl font-semibold mb-4">
        Upload Medical Bill
      </h2>

      <input type="file" onChange={handleUpload} />

      {loading && <p>Analyzing bill...</p>}

      {result && (
        <div className="mt-4">
          <h3 className="font-bold">⚠ Flagged Charges</h3>
          <ul>
            {result.flags.map((flag, i) => (
              <li key={i}>• {flag}</li>
            ))}
          </ul>

          <p className="mt-2">{result.summary}</p>
        </div>
      )}
    </div>
  );
}