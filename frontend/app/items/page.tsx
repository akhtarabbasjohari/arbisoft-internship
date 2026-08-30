"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchWithAuth } from "../lib/api";
import { useDebounce } from "../lib/useDebounce";
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

  // Search State with Debounce
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  // UI States (Loading, Searching, Submitting, Errors)
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
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

  // 1. READ / SEARCH: Fetch notes from Django backend with search & auth
  const fetchNotes = useCallback(
    async (query: string = "") => {
      try {
        if (query.trim()) {
          setIsSearching(true);
        } else {
          if (notes.length === 0) setLoading(true);
        }
        setError(null);

        const endpoint = query.trim()
          ? `/notes/?title=${encodeURIComponent(query.trim())}`
          : "/notes/";

        const res = await fetchWithAuth(endpoint);
        if (!res.ok) {
          throw new Error("Failed to fetch notes from backend.");
        }
        const data = await res.json();
        setNotes(data);
      } catch (err: any) {
        setError(err.message || "Could not load notes.");
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    },
    [notes.length]
  );

  // Trigger search when token is available and debounced search term changes
  useEffect(() => {
    if (token) {
      fetchNotes(debouncedSearch);
    }
  }, [token, debouncedSearch]);

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
        throw new Error(errorData.title?.[0] || errorData.content?.[0] || "Failed to create note.");
      }

      const newNote = await res.json();
      setNotes((prevNotes) => [newNote, ...prevNotes]);
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
        throw new Error(errorData.title?.[0] || errorData.content?.[0] || "Failed to update note.");
      }

      const updatedNote = await res.json();
      setNotes((prevNotes) => prevNotes.map((n) => (n.id === id ? updatedNote : n)));
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
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete note.");
    }
  };

  if (isLoading || (loading && notes.length === 0 && !debouncedSearch)) {
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
          role="alert"
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

      {/* 🔍 Search Input with Debouncing */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes by title or content..."
            aria-label="Search notes"
            style={{
              width: "100%",
              padding: "10px 38px 10px 38px",
              fontSize: "0.9rem",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              outline: "none",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "12px",
              color: "#9ca3af",
              fontSize: "0.9rem",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              title="Clear search"
              aria-label="Clear search"
              style={{
                position: "absolute",
                right: "12px",
                backgroundColor: "#e5e7eb",
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#4b5563",
                fontSize: "0.75rem",
                padding: 0,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Subtle in-flight search status indicator */}
        {isSearching && (
          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              paddingLeft: "4px",
            }}
          >
            <span>⏳</span> Searching notes...
          </div>
        )}
      </div>

      {/* Notes List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#111827", margin: 0 }}>
            {debouncedSearch.trim() ? "Search Results" : "All Notes"} ({notes.length})
          </h2>
          {debouncedSearch.trim() && (
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              Filtering for: &ldquo;{debouncedSearch}&rdquo;
            </span>
          )}
        </div>

        {notes.length === 0 ? (
          <div
            style={{
              padding: "28px 20px",
              backgroundColor: "#ffffff",
              border: "1px dashed #d1d5db",
              borderRadius: "6px",
              textAlign: "center",
              color: "#6b7280",
              fontSize: "0.9rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {debouncedSearch.trim() ? (
              <>
                <span style={{ fontSize: "1.2rem" }}>🔍</span>
                <span>
                  No notes found matching &ldquo;<strong>{debouncedSearch}</strong>&rdquo;.
                </span>
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    backgroundColor: "#f3f4f6",
                    color: "#374151",
                    border: "1px solid #d1d5db",
                    borderRadius: "4px",
                    padding: "4px 12px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    marginTop: "4px",
                  }}
                >
                  Clear Search Filter
                </button>
              </>
            ) : (
              <span>No notes found. Create your first note above!</span>
            )}
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
                      style={{
                        padding: "6px 10px",
                        fontSize: "0.9rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                      }}
                    />
                    <textarea
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      style={{
                        padding: "6px 10px",
                        fontSize: "0.9rem",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db",
                      }}
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => handleUpdateNote(note.id)}
                        disabled={submitting}
                        style={{
                          backgroundColor: "#16a34a",
                          color: "#fff",
                          border: "none",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditingNoteId(null)}
                        style={{
                          backgroundColor: "#6b7280",
                          color: "#fff",
                          border: "none",
                          padding: "4px 12px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Read Mode Display */
                  <>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: 600,
                            color: "#111827",
                            margin: "0 0 2px 0",
                          }}
                        >
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

                    <p
                      style={{
                        color: "#374151",
                        fontSize: "0.9rem",
                        margin: 0,
                        whiteSpace: "pre-wrap",
                      }}
                    >
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
