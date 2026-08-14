"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../lib/api";
import { useAuth } from "../context/AuthContext";

interface Note {
  id: number;
  user_id: number;
  user_username: string;
  title: string;
  content: string;
  created_at: string;
}

export default function ItemsPage() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // UI States (Loading, Submitting, Errors)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit Mode State
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // 🛡️ Protect Route: Redirect unauthenticated users to /login
  useEffect(() => {
    if (!isLoading && !token) {
      router.push("/login");
    }
  }, [isLoading, token, router]);

  // 1. READ: Fetch all notes from Django backend
  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth("/notes/");
      if (!res.ok) {
        throw new Error("Failed to fetch notes from backend.");
      }
      const data = await res.json();
      setNotes(data);
    } catch (err: any) {
      setError(err.message || "Could not load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  // 2. CREATE: Submit new note to Django backend
  const handleCreateNote = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetchWithAuth("/notes/", {
        method: "POST",
        body: JSON.stringify({ title, content }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.title?.[0] || errorData.content?.[0] || "Failed to create note."
        );
      }

      const newNote = await res.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (err: any) {
      setError(err.message || "Note creation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // 3. UPDATE: Start Edit Mode for a Note
  const startEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  // Save Updated Note to Backend
  const handleUpdateNote = async (id: number) => {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetchWithAuth(`/notes/${id}/`, {
        method: "PUT",
        body: JSON.stringify({ title: editTitle, content: editContent }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.title?.[0] || errorData.content?.[0] || "Failed to update note."
        );
      }

      const updatedNote = await res.json();
      setNotes(notes.map((n) => (n.id === id ? updatedNote : n)));
      setEditingNoteId(null);
    } catch (err: any) {
      setError(err.message || "Note update failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // 4. DELETE: Delete Note from Backend
  const handleDeleteNote = async (id: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetchWithAuth(`/notes/${id}/`, { method: "DELETE" });
      if (!res.ok) {
        throw new Error("You can only delete notes created by you.");
      }
      setNotes(notes.filter((n) => n.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete note.");
    }
  };

  if (isLoading || (loading && notes.length === 0)) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
        ⌛ Loading notes directory from Django API...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#111827", margin: "0 0 4px 0" }}>
          Notes Directory
        </h1>
        <p style={{ color: "#4b5563", fontSize: "0.95rem", margin: 0 }}>
          Logged in as: <strong>{user?.username || "Authenticated User"}</strong>
        </p>
      </div>

      {/* Inline Error Message Alert */}
      {error && (
        <div
          style={{
            padding: "10px 14px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "6px",
            color: "#991b1b",
            fontSize: "0.85rem",
          }}
        >
          🚨 {error}
        </div>
      )}

      {/* Create New Note Form */}
      <form
        onSubmit={handleCreateNote}
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
          Add New Note
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title (min 3 characters)"
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
          <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#374151" }}>Content</label>
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content (min 5 characters)"
            required
            style={{
              padding: "8px 12px",
              fontSize: "0.9rem",
              borderRadius: "5px",
              border: "1px solid #d1d5db",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={submitting}
            style={{
              backgroundColor: "#111827",
              color: "#ffffff",
              padding: "8px 16px",
              borderRadius: "5px",
              fontSize: "0.85rem",
              fontWeight: 500,
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? "Saving..." : "Create Note"}
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827", margin: 0 }}>
          All Notes ({notes.length})
        </h2>

        {notes.length === 0 ? (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#ffffff",
              border: "1px dashed #d1d5db",
              borderRadius: "6px",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "0.9rem",
            }}
          >
            No notes found. Create your first note above!
          </div>
        ) : (
          notes.map((note) => {
            // 🛡️ Check if the logged-in user is the author or an admin
            const canModify = Boolean(user?.is_staff || user?.username === note.user_username);

            return (
              <div
                key={note.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {editingNoteId === note.id ? (
                  /* Edit Mode Form */
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      style={{ padding: "6px 10px", fontSize: "0.9rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    />
                    <textarea
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{ padding: "6px 10px", fontSize: "0.9rem", borderRadius: "4px", border: "1px solid #d1d5db" }}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleUpdateNote(note.id)}
                        disabled={submitting}
                        style={{ backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "4px 12px", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        style={{ backgroundColor: "#6b7280", color: "#fff", border: "none", padding: "4px 12px", borderRadius: "4px", fontSize: "0.8rem", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Read Mode Display */
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827", margin: "0 0 2px 0" }}>
                          {note.title}
                        </h3>
                        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                          Written by <strong>{note.user_username}</strong>
                        </span>
                      </div>

                      {/* 🛡️ Render Edit/Delete options ONLY if the logged-in user is the author or admin */}
                      {canModify && (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => startEditNote(note)}
                            style={{
                              backgroundColor: "#f3f4f6",
                              color: "#374151",
                              border: "1px solid #d1d5db",
                              borderRadius: "4px",
                              padding: "4px 10px",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            style={{
                              backgroundColor: "#fef2f2",
                              color: "#991b1b",
                              border: "1px solid #fca5a5",
                              borderRadius: "4px",
                              padding: "4px 10px",
                              fontSize: "0.8rem",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    <p style={{ color: "#374151", fontSize: "0.9rem", margin: 0, whiteSpace: "pre-wrap" }}>
                      {note.content}
                    </p>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}