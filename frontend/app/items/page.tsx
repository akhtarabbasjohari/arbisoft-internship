"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

interface Item {
  id: string;
  name: string;
  description: string;
}

const initialMockItems: Item[] = [
  { id: "1", name: "Item One", description: "First item entry with basic configuration." },
  { id: "2", name: "Item Two", description: "Second item entry with updated specifications." },
  { id: "3", name: "Item Three", description: "Third item entry containing system parameters." },
  { id: "4", name: "Item Four", description: "Fourth item entry reserved for testing." },
];

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>(initialMockItems);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: { name?: string; description?: string } = {};

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      newErrors.name = "Name is required.";
    } else if (trimmedName.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    if (!trimmedDescription) {
      newErrors.description = "Description is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear validation errors and append new item
    setErrors({});
    const newItem: Item = {
      id: String(items.length + 1),
      name: trimmedName,
      description: trimmedDescription,
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setName("");
    setDescription("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>
          Items Directory
        </h1>
        <p style={{ color: "#4b5563", fontSize: "0.95rem", margin: 0 }}>
          Select any item below to view its detail page or add a new item using the form.
        </p>
      </div>

      {/* Add New Item Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "6px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827", margin: 0 }}>
          Add New Item
        </h2>

        {/* Name Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="item-name" style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>
            Name
          </label>
          <input
            id="item-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            placeholder="e.g. Item Five"
            style={{
              padding: "8px 12px",
              fontSize: "0.9rem",
              borderRadius: "5px",
              border: `1px solid ${errors.name ? "#f87171" : "#d1d5db"}`,
              backgroundColor: "#ffffff",
              color: "#111827",
              outline: "none",
            }}
          />
          {errors.name && (
            <span style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: "2px" }}>
              {errors.name}
            </span>
          )}
        </div>

        {/* Description Field */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label htmlFor="item-description" style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>
            Description
          </label>
          <textarea
            id="item-description"
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            placeholder="Brief item description..."
            style={{
              padding: "8px 12px",
              fontSize: "0.9rem",
              borderRadius: "5px",
              border: `1px solid ${errors.description ? "#f87171" : "#d1d5db"}`,
              backgroundColor: "#ffffff",
              color: "#111827",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          {errors.description && (
            <span style={{ fontSize: "0.8rem", color: "#b91c1c", marginTop: "2px" }}>
              {errors.description}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            style={{
              backgroundColor: "#111827",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "5px",
              fontSize: "0.85rem",
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Item
          </button>
        </div>
      </form>

      {/* Items List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>
          Existing Items ({items.length})
        </h2>
        {items.map((item) => (
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
