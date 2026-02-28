export async function analyzeBill(billText) {
  const res = await fetch(
    process.env.NEXT_PUBLIC_MODAL_ANALYZE_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bill_text: billText,
      }),
    }
  );

  return await res.json();
}