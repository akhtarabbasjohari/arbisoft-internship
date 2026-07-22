import Link from "next/link";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", margin: "0 0 8px 0" }}>
          Welcome to the SPA Demo
        </h1>
        <p style={{ color: "#4b5563", fontSize: "0.95rem", margin: 0 }}>
          A clean, functional single-page application demonstrating Next.js App Router fundamentals.
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "20px",
          marginTop: "8px",
        }}
      >
        <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827", margin: "0 0 8px 0" }}>
          Overview
        </h2>
        <p style={{ color: "#4b5563", fontSize: "0.9rem", margin: "0 0 16px 0", lineHeight: "1.6" }}>
          This application features shared layouts, nested routes, and dynamic URL parameter handling with zero bloated UI frameworks.
        </p>
        <Link
          href="/items"
          style={{
            display: "inline-block",
            backgroundColor: "#111827",
            color: "#ffffff",
            padding: "8px 14px",
            borderRadius: "5px",
            fontSize: "0.85rem",
            fontWeight: 500,
            textDecoration: "none",
          }}
        >
          View Items List &rarr;
        </Link>
      </div>
    </div>
  );
}
