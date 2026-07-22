import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "App Router SPA",
  description: "Simple, functional Next.js App Router SPA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <header
            style={{
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #e5e7eb",
              padding: "0 24px",
            }}
          >
            <div
              style={{
                maxWidth: "768px",
                margin: "0 auto",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "#111827" }}>
                TaskFlow
              </span>
              <nav style={{ display: "flex", gap: "20px" }}>
                <Link
                  href="/"
                  style={{
                    color: "#374151",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  Home
                </Link>
                <Link
                  href="/items"
                  style={{
                    color: "#374151",
                    textDecoration: "none",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  Items
                </Link>
              </nav>
            </div>
          </header>

          <main style={{ flex: 1, padding: "32px 24px" }}>
            <div style={{ maxWidth: "768px", margin: "0 auto" }}>{children}</div>
          </main>

          <footer
            style={{
              borderTop: "1px solid #e5e7eb",
              padding: "16px 24px",
              textAlign: "center",
              fontSize: "0.8rem",
              color: "#9ca3af",
              backgroundColor: "#ffffff",
            }}
          >
            Fundamentals SPA &bull; Built with Next.js App Router
          </footer>
        </div>
      </body>
    </html>
  );
}
