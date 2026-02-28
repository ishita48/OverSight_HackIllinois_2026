"use client";

export default function SimpleOnboardingTest() {
  const handleClick = () => {
    console.log("Button clicked!");
    alert("Button works!");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#faf8f4",
        padding: "20px",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "20px", color: "#2a2a2a" }}>
          Simple Test Page
        </h1>

        <button
          onClick={handleClick}
          style={{
            backgroundColor: "#d4735f",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Test Button 1
        </button>

        <button
          onClick={() => console.log("Button 2 clicked")}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "12px 24px",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Test Button 2
        </button>

        <div style={{ marginTop: "20px", color: "#666" }}>
          <p>If you can see this and click the buttons, the page is working!</p>
          <p>Check your browser console for click logs.</p>
        </div>
      </div>
    </div>
  );
}
