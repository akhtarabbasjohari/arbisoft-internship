import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ItemDetailPage({ params }: Props) {
  const { id } = await params;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <Link
          href="/items"
          style={{
            color: "#4b5563",
            textDecoration: "none",
            fontSize: "0.85rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "12px",
          }}
        >
          &larr; Back to items
        </Link>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>
          Item #{id} Detail
        </h1>
        <p style={{ color: "#6b7280", fontSize: "0.9rem", margin: 0 }}>
          Viewing dynamic route at <code style={{ backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px", fontSize: "0.85rem" }}>/items/{id}</code>
        </p>
      </div>

      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>
          <span style={{ width: "120px", fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
            Item ID:
          </span>
          <span style={{ fontSize: "0.85rem", color: "#111827", fontFamily: "monospace", fontWeight: 600 }}>
            {id}
          </span>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid #f3f4f6", paddingBottom: "10px" }}>
          <span style={{ width: "120px", fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
            Route Param:
          </span>
          <span style={{ fontSize: "0.85rem", color: "#111827" }}>
            Parsed successfully from URL
          </span>
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ width: "120px", fontSize: "0.85rem", color: "#6b7280", fontWeight: 500 }}>
            Status:
          </span>
          <span style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 500 }}>
            Active / Mocked
          </span>
        </div>
      </div>
    </div>
  );
}
