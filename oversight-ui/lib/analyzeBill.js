export async function analyzeBill(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
    process.env.NEXT_PUBLIC_MODAL_PDF_URL,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Analysis failed");
  }

  return await res.json();
}