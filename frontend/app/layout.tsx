"use client";

import Link from "next/link";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./globals.css";

function Navbar() {
  const { user, token, logout } = useAuth();

  return (
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
          TaskFlow Notes
        </span>
        <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
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
            Notes
          </Link>
          {token || user ? (
            <button
              onClick={logout}
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                border: "1px solid #d1d5db",
                borderRadius: "5px",
                padding: "4px 10px",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              Logout ({user?.username || "User"})
            </button>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  color: "#374151",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Login
              </Link>
              <Link
                href="/register"
                style={{
                  backgroundColor: "#111827",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  padding: "4px 12px",
                  borderRadius: "5px",
                }}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
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
              Django REST + Next.js App Router &bull; Full-Stack Notes Application
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}