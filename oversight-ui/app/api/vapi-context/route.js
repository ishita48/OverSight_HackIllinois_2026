export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    const response = await fetch(process.env.MODAL_ANALYZE_URL, {
      method: "POST",
      body: await file.arrayBuffer(),
    });

    const data = await response.json();

    // ✅ NOW SAFE TO USE
    const userId = formData.get("user_id") || "anonymous";

    await supermemory.add({
      content: JSON.stringify(data),
      containerTags: [`user-${userId}`],
    });

    return NextResponse.json(data);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}