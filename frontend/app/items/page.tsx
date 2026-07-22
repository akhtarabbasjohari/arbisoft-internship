import Link from "next/link";

const mockItems = [
  { id: "1", name: "Item One", description: "First item entry with basic configuration." },
  { id: "2", name: "Item Two", description: "Second item entry with updated specifications." },
  { id: "3", name: "Item Three", description: "Third item entry containing system parameters." },
  { id: "4", name: "Item Four", description: "Fourth item entry reserved for testing." },
];

export default function ItemsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>
          Items Directory
        </h1>
        <p style={{ color: "#4b5563", fontSize: "0.95rem", margin: 0 }}>
          Select any item below to view its dynamic detail page.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {mockItems.map((item) => (
          <Link
            key={item.id}
            href={`/items/${item.id}`}
            style={{
              display: "block",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "16px",
              textDecoration: "none",
              transition: "border-color 0.15s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "#111827", fontSize: "0.95rem" }}>
                {item.name}
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontFamily: "monospace",
                  color: "#6b7280",
                  backgroundColor: "#f3f4f6",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb",
                }}
              >
                ID: {item.id}
              </span>
            </div>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: "6px 0 0 0" }}>
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
