"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

function LoginFormContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setInfoMessage("Registration successful! Please log in with your credentials.");
    } else if (searchParams.get("expired") === "true") {
      setError("Your session has expired. Please log in again.");
    }
  }, [searchParams]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      const res = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!res.ok) {
        throw new Error("Invalid username or password.");
      }

      const data = await res.json();
      // Store token pair in LocalStorage via AuthContext & update state
      login(data.access, data.refresh, { id: 1, username: username.trim(), is_staff: false });
      router.push("/items");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>
        Login to Notes Directory
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "20px" }}>
        Enter your credentials to access your protected notes.
      </p>

      {infoMessage && (
        <div
          style={{
            padding: "10px 12px",
            backgroundColor: "#ecfdf5",
            border: "1px solid #a7f3d0",
            borderRadius: "6px",
            color: "#065f46",
            fontSize: "0.85rem",
            marginBottom: "16px",
          }}
        >
          {infoMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "10px 12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "6px",
            color: "#991b1b",
            fontSize: "0.85rem",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="login-username"
            style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}
          >
            Username
          </label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            style={{
              padding: "8px 12px",
              fontSize: "0.9rem",
              borderRadius: "5px",
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="login-password"
            style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}
          >
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            style={{
              padding: "8px 12px",
              fontSize: "0.9rem",
              borderRadius: "5px",
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#111827",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "0.9rem",
            fontWeight: 500,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </form>

      <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "20px", textAlign: "center" }}>
        Don't have an account yet?{" "}
        <Link
          href="/register"
          style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}
        >
          Register here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login page...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
