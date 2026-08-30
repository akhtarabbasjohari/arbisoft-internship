"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      setError("Username cannot be empty.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: trimmedUsername,
          email: trimmedEmail, // Optional email field sent to backend
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.username?.[0] ||
            errorData.email?.[0] ||
            errorData.password?.[0] ||
            "Registration failed. Try a different username."
        );
      }

      // Success -> Redirect to login page
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>
        Create an Account
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "20px" }}>
        Sign up to start creating and managing your notes.
      </p>

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
        onSubmit={handleRegister}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        {/* Username Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="reg-username"
            style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}
          >
            Username *
          </label>
          <input
            id="reg-username"
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

        {/* Email Field (Optional) */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="reg-email"
            style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}
          >
            Email Address <span style={{ color: "#9ca3af", fontWeight: 400 }}>(Optional)</span>
          </label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@example.com"
            style={{
              padding: "8px 12px",
              fontSize: "0.9rem",
              borderRadius: "5px",
              border: "1px solid #d1d5db",
              outline: "none",
            }}
          />
        </div>

        {/* Password Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label
            htmlFor="reg-password"
            style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}
          >
            Password * (min 6 characters)
          </label>
          <input
            id="reg-password"
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
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>

      <p style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "20px", textAlign: "center" }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
          Login here
        </Link>
      </p>
    </div>
  );
}
