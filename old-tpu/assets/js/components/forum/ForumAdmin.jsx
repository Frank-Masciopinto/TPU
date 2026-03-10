import React from "react";

import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Input } from "../ui/Input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/Sheet";
import { Textarea } from "../ui/Textarea";

import { ImageUploader } from "./ImageUploader";
import { timeAgo } from "./timeAgo";

// ---------------------------------------------------------------------------
// Icons (inline SVG to avoid external deps)
// ---------------------------------------------------------------------------

function IconLock({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconUnlock({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  );
}

function IconPin({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

function IconTrash({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function IconReply({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

function IconEdit({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconSearch({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconRefresh({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const ADMIN_BANNER_STYLE = {
  padding: "8px 16px",
  backgroundColor: "#fef3cd",
  borderBottom: "2px solid #f0ad4e",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontSize: "13px",
  fontWeight: 600,
  color: "#856404",
};

const STATS_GRID_STYLE = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "12px",
  marginBottom: "24px",
};

const STAT_CARD_STYLE = {
  textAlign: "center",
  padding: "16px",
};

const STAT_VALUE_STYLE = {
  fontSize: "28px",
  fontWeight: 700,
  lineHeight: 1.2,
};

const STAT_LABEL_STYLE = {
  fontSize: "12px",
  color: "#666",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginTop: "4px",
};

const TAB_BAR_STYLE = {
  display: "flex",
  gap: "4px",
  marginBottom: "20px",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: "0",
};

const THREAD_ROW_STYLE = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: "1px solid #f0f0f0",
  gap: "12px",
};

const FILTER_BAR_STYLE = {
  display: "flex",
  gap: "8px",
  marginBottom: "16px",
  flexWrap: "wrap",
  alignItems: "center",
};

// ---------------------------------------------------------------------------
// AdminTab button
// ---------------------------------------------------------------------------

function AdminTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "8px 16px",
        fontSize: "14px",
        fontWeight: active ? 600 : 400,
        color: active ? "#e62223" : "#666",
        background: "none",
        border: "none",
        borderBottom: active ? "2px solid #e62223" : "2px solid transparent",
        cursor: "pointer",
        marginBottom: "-1px",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// FilterChip
// ---------------------------------------------------------------------------

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "4px 12px",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
        color: active ? "#fff" : "#555",
        backgroundColor: active ? "#e62223" : "#f3f4f6",
        border: "1px solid " + (active ? "#e62223" : "#d1d5db"),
        borderRadius: "16px",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// DeleteConfirmDrawer (re-implementation for admin context)
// ---------------------------------------------------------------------------

function AdminDeleteDrawer({ open, onOpenChange, onConfirm, targetType, isDeleting }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Delete {targetType}?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. The {targetType} and all associated data will be permanently removed.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            style={{ backgroundColor: "#e62223" }}
          >
            {isDeleting ? "Deleting..." : `Delete ${targetType}`}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// AdminQuickReplyDrawer
// ---------------------------------------------------------------------------

function AdminQuickReplyDrawer({ open, onOpenChange, threadTitle, onSubmit, isSubmitting, api }) {
  const [replyBody, setReplyBody] = React.useState("");
  const [images, setImages] = React.useState([]);

  React.useEffect(() => {
    if (open) {
      setReplyBody("");
      setImages([]);
    }
  }, [open]);

  const handleSubmit = () => {
    if (replyBody.trim().length < 5) return;
    onSubmit({ body: replyBody.trim(), images });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" style={{ maxHeight: "80vh", overflow: "auto" }}>
        <SheetHeader>
          <SheetTitle>Reply as Admin</SheetTitle>
          <SheetDescription>
            Replying to: {threadTitle}
          </SheetDescription>
        </SheetHeader>
        <div style={{ padding: "16px 0" }}>
          <Textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            placeholder="Write your reply..."
            rows={6}
            style={{ marginBottom: "12px" }}
          />
          <ImageUploader
            images={images}
            onImagesChange={setImages}
            uploadImage={(file) => api.uploadImage(file)}
            maxImages={3}
          />
        </div>
        <SheetFooter style={{ display: "flex", gap: "8px" }}>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || replyBody.trim().length < 5}
            style={{ backgroundColor: "#e62223", color: "#fff" }}
          >
            {isSubmitting ? "Posting..." : "Post Reply"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// AdminEditDrawer
// ---------------------------------------------------------------------------

function AdminEditDrawer({ open, onOpenChange, thread, onSubmit, isSubmitting }) {
  const [title, setTitle] = React.useState("");
  const [summary, setSummary] = React.useState("");

  React.useEffect(() => {
    if (open && thread) {
      setTitle(thread.title || "");
      setSummary(thread.summary || "");
    }
  }, [open, thread]);

  const handleSubmit = () => {
    const updates = {};
    if (title.trim() !== (thread?.title || "")) updates.title = title.trim();
    if (summary.trim() !== (thread?.summary || "")) updates.summary = summary.trim();
    if (!Object.keys(updates).length) {
      onOpenChange(false);
      return;
    }
    onSubmit(updates);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" style={{ maxHeight: "80vh", overflow: "auto" }}>
        <SheetHeader>
          <SheetTitle>Edit Thread</SheetTitle>
        </SheetHeader>
        <div style={{ padding: "16px 0", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
              Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "4px" }}>
              Summary (TL;DR)
            </label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief answer summary shown below the title..."
              rows={3}
              maxLength={500}
            />
          </div>
        </div>
        <SheetFooter style={{ display: "flex", gap: "8px" }}>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ backgroundColor: "#e62223", color: "#fff" }}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Thread row for admin lists
// ---------------------------------------------------------------------------

function AdminThreadRow({ thread, onReply, onLock, onPin, onDelete, onEdit, onView }) {
  return (
    <div style={THREAD_ROW_STYLE}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          {thread.is_pinned && <Badge variant="outline" style={{ fontSize: "10px", color: "#9333ea" }}>Pinned</Badge>}
          {thread.is_locked && <Badge variant="outline" style={{ fontSize: "10px", color: "#dc2626" }}>Locked</Badge>}
          <a
            href={`/forum/thread?slug=${encodeURIComponent(thread.slug || thread.id)}`}
            onClick={(e) => { e.preventDefault(); onView(thread); }}
            style={{
              fontWeight: 500,
              fontSize: "14px",
              color: "#111",
              textDecoration: "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={thread.title}
          >
            {thread.title}
          </a>
        </div>
        <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
          {thread.comment_count || 0} replies &middot; score {thread.score || 0} &middot; {timeAgo(thread.created_at)}
          {thread.author && <> &middot; by {thread.author}</>}
        </div>
      </div>
      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
        <Button variant="ghost" size="sm" onClick={() => onReply(thread)} title="Reply">
          <IconReply size={14} />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(thread)} title="Edit">
          <IconEdit size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLock(thread)}
          title={thread.is_locked ? "Unlock" : "Lock"}
        >
          {thread.is_locked ? <IconUnlock size={14} /> : <IconLock size={14} />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPin(thread)}
          title={thread.is_pinned ? "Unpin" : "Pin"}
          style={{ color: thread.is_pinned ? "#9333ea" : undefined }}
        >
          <IconPin size={14} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(thread)}
          title="Delete"
          style={{ color: "#dc2626" }}
        >
          <IconTrash size={14} />
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminDashboard
// ---------------------------------------------------------------------------

function AdminDashboard({ api, navigate }) {
  const [unreplied, setUnreplied] = React.useState([]);
  const [stats, setStats] = React.useState({ unreplied: 0, total: 0, oldest: null });
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  // Drawers
  const [replyThread, setReplyThread] = React.useState(null);
  const [editThread, setEditThread] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAdminThreads("unreplied", "oldest", 1, 50);
      setUnreplied(data.threads || []);
      const oldestThread = (data.threads || [])[0];
      setStats({
        unreplied: data.total || 0,
        total: 0,
        oldest: oldestThread ? oldestThread.created_at : null,
      });

      const allData = await api.getAdminThreads("all", "newest", 1, 1);
      setStats((s) => ({ ...s, total: allData.total || 0 }));
    } catch (e) {
      console.error("[Admin] Failed to load dashboard:", e);
    } finally {
      setLoading(false);
    }
  }, [api]);

  React.useEffect(() => { load(); }, [load]);

  const oldestWaitDays = React.useMemo(() => {
    if (!stats.oldest) return 0;
    return Math.floor((Date.now() - new Date(stats.oldest).getTime()) / 86400000);
  }, [stats.oldest]);

  const handleReplySubmit = async (payload) => {
    if (!replyThread) return;
    setBusy(true);
    try {
      await api.createComment(replyThread.id, payload);
      setReplyThread(null);
      // Optimistic: remove from unreplied list
      setUnreplied((prev) => prev.filter((t) => t.id !== replyThread.id));
      setStats((s) => ({ ...s, unreplied: Math.max(0, s.unreplied - 1) }));
    } catch (e) {
      console.error("[Admin] Reply failed:", e);
      alert("Failed to post reply: " + (e.message || "Unknown error"));
    } finally {
      setBusy(false);
    }
  };

  const handleLock = async (thread) => {
    setBusy(true);
    try {
      await api.patchThread(thread.id, { is_locked: !thread.is_locked });
      setUnreplied((prev) =>
        prev.map((t) => t.id === thread.id ? { ...t, is_locked: !t.is_locked } : t)
      );
    } catch (e) {
      console.error("[Admin] Lock failed:", e);
    } finally {
      setBusy(false);
    }
  };

  const handlePin = async (thread) => {
    setBusy(true);
    try {
      await api.patchThread(thread.id, { is_pinned: !thread.is_pinned });
      setUnreplied((prev) =>
        prev.map((t) => t.id === thread.id ? { ...t, is_pinned: !t.is_pinned } : t)
      );
    } catch (e) {
      console.error("[Admin] Pin failed:", e);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await api.deleteThread(deleteTarget.id);
      setUnreplied((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setStats((s) => ({
        ...s,
        unreplied: Math.max(0, s.unreplied - 1),
        total: Math.max(0, s.total - 1),
      }));
      setDeleteTarget(null);
    } catch (e) {
      console.error("[Admin] Delete failed:", e);
      alert("Failed to delete: " + (e.message || "Unknown error"));
    } finally {
      setBusy(false);
    }
  };

  const handleEditSubmit = async (updates) => {
    if (!editThread) return;
    setBusy(true);
    try {
      await api.patchThread(editThread.id, updates);
      setUnreplied((prev) =>
        prev.map((t) => t.id === editThread.id ? { ...t, ...updates } : t)
      );
      setEditThread(null);
    } catch (e) {
      console.error("[Admin] Edit failed:", e);
      alert("Failed to save: " + (e.message || "Unknown error"));
    } finally {
      setBusy(false);
    }
  };

  const handleView = (thread) => {
    navigate(`/forum/thread?slug=${encodeURIComponent(thread.slug || thread.id)}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "48px 0", color: "#888" }}>
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* Stats */}
      <div style={STATS_GRID_STYLE}>
        <Card style={STAT_CARD_STYLE}>
          <div style={{ ...STAT_VALUE_STYLE, color: stats.unreplied > 0 ? "#dc2626" : "#16a34a" }}>
            {stats.unreplied}
          </div>
          <div style={STAT_LABEL_STYLE}>Unreplied</div>
        </Card>
        <Card style={STAT_CARD_STYLE}>
          <div style={{ ...STAT_VALUE_STYLE, color: oldestWaitDays > 3 ? "#dc2626" : "#666" }}>
            {oldestWaitDays > 0 ? `${oldestWaitDays}d` : "--"}
          </div>
          <div style={STAT_LABEL_STYLE}>Oldest Wait</div>
        </Card>
        <Card style={STAT_CARD_STYLE}>
          <div style={STAT_VALUE_STYLE}>{stats.total}</div>
          <div style={STAT_LABEL_STYLE}>Total Threads</div>
        </Card>
      </div>

      {/* Unreplied queue */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
          Unreplied Threads
        </h3>
        <Button variant="ghost" size="sm" onClick={load} title="Refresh">
          <IconRefresh size={14} />
        </Button>
      </div>

      {unreplied.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "32px" }}>
          <CardContent>
            <p style={{ margin: 0, color: "#16a34a", fontWeight: 600, fontSize: "15px" }}>
              All caught up — no unreplied threads
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          {unreplied.map((thread) => (
            <AdminThreadRow
              key={thread.id}
              thread={thread}
              onReply={setReplyThread}
              onEdit={setEditThread}
              onLock={handleLock}
              onPin={handlePin}
              onDelete={setDeleteTarget}
              onView={handleView}
            />
          ))}
        </Card>
      )}

      {/* Drawers */}
      <AdminQuickReplyDrawer
        open={!!replyThread}
        onOpenChange={(open) => { if (!open) setReplyThread(null); }}
        threadTitle={replyThread?.title || ""}
        onSubmit={handleReplySubmit}
        isSubmitting={busy}
        api={api}
      />
      <AdminEditDrawer
        open={!!editThread}
        onOpenChange={(open) => { if (!open) setEditThread(null); }}
        thread={editThread}
        onSubmit={handleEditSubmit}
        isSubmitting={busy}
      />
      <AdminDeleteDrawer
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        targetType="thread"
        isDeleting={busy}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminThreadList
// ---------------------------------------------------------------------------

function AdminThreadList({ api, navigate }) {
  const [threads, setThreads] = React.useState([]);
  const [filter, setFilter] = React.useState("all");
  const [sort, setSort] = React.useState("newest");
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  // Drawers
  const [replyThread, setReplyThread] = React.useState(null);
  const [editThread, setEditThread] = React.useState(null);
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAdminThreads(filter, sort, page, 20);
      setThreads(data.threads || []);
      setTotal(data.total || 0);
      setHasMore(data.has_more || false);
    } catch (e) {
      console.error("[Admin] Failed to load threads:", e);
    } finally {
      setLoading(false);
    }
  }, [api, filter, sort, page]);

  React.useEffect(() => { load(); }, [load]);

  const handleFilterChange = (f) => {
    setFilter(f);
    setPage(1);
  };

  const handleLock = async (thread) => {
    setBusy(true);
    try {
      await api.patchThread(thread.id, { is_locked: !thread.is_locked });
      setThreads((prev) =>
        prev.map((t) => t.id === thread.id ? { ...t, is_locked: !t.is_locked } : t)
      );
    } catch (e) {
      console.error("[Admin] Lock failed:", e);
    } finally {
      setBusy(false);
    }
  };

  const handlePin = async (thread) => {
    setBusy(true);
    try {
      await api.patchThread(thread.id, { is_pinned: !thread.is_pinned });
      setThreads((prev) =>
        prev.map((t) => t.id === thread.id ? { ...t, is_pinned: !t.is_pinned } : t)
      );
    } catch (e) {
      console.error("[Admin] Pin failed:", e);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await api.deleteThread(deleteTarget.id);
      setThreads((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setTotal((t) => Math.max(0, t - 1));
      setDeleteTarget(null);
    } catch (e) {
      console.error("[Admin] Delete failed:", e);
    } finally {
      setBusy(false);
    }
  };

  const handleReplySubmit = async (payload) => {
    if (!replyThread) return;
    setBusy(true);
    try {
      await api.createComment(replyThread.id, payload);
      setReplyThread(null);
      setThreads((prev) =>
        prev.map((t) => t.id === replyThread.id ? { ...t, comment_count: (t.comment_count || 0) + 1 } : t)
      );
    } catch (e) {
      console.error("[Admin] Reply failed:", e);
      alert("Failed to post reply: " + (e.message || "Unknown error"));
    } finally {
      setBusy(false);
    }
  };

  const handleEditSubmit = async (updates) => {
    if (!editThread) return;
    setBusy(true);
    try {
      await api.patchThread(editThread.id, updates);
      setThreads((prev) =>
        prev.map((t) => t.id === editThread.id ? { ...t, ...updates } : t)
      );
      setEditThread(null);
    } catch (e) {
      console.error("[Admin] Edit failed:", e);
    } finally {
      setBusy(false);
    }
  };

  const handleView = (thread) => {
    navigate(`/forum/thread?slug=${encodeURIComponent(thread.slug || thread.id)}`);
  };

  return (
    <div>
      <div style={FILTER_BAR_STYLE}>
        <FilterChip active={filter === "all"} onClick={() => handleFilterChange("all")}>All</FilterChip>
        <FilterChip active={filter === "unreplied"} onClick={() => handleFilterChange("unreplied")}>Unreplied</FilterChip>
        <FilterChip active={filter === "locked"} onClick={() => handleFilterChange("locked")}>Locked</FilterChip>
        <FilterChip active={filter === "pinned"} onClick={() => handleFilterChange("pinned")}>Pinned</FilterChip>
        <div style={{ marginLeft: "auto", display: "flex", gap: "8px", alignItems: "center" }}>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            style={{
              padding: "4px 8px", fontSize: "13px", border: "1px solid #d1d5db",
              borderRadius: "6px", background: "#fff",
            }}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="score">Top Score</option>
          </select>
          <Button variant="ghost" size="sm" onClick={load} title="Refresh">
            <IconRefresh size={14} />
          </Button>
        </div>
      </div>

      <div style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
        {total} thread{total !== 1 ? "s" : ""} found
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "32px", color: "#888" }}>Loading...</div>
      ) : threads.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "32px" }}>
          <CardContent>
            <p style={{ margin: 0, color: "#888" }}>No threads match this filter.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            {threads.map((thread) => (
              <AdminThreadRow
                key={thread.id}
                thread={thread}
                onReply={setReplyThread}
                onEdit={setEditThread}
                onLock={handleLock}
                onPin={handlePin}
                onDelete={setDeleteTarget}
                onView={handleView}
              />
            ))}
          </Card>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span style={{ padding: "6px 12px", fontSize: "13px", color: "#666" }}>
              Page {page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      {/* Drawers */}
      <AdminQuickReplyDrawer
        open={!!replyThread}
        onOpenChange={(open) => { if (!open) setReplyThread(null); }}
        threadTitle={replyThread?.title || ""}
        onSubmit={handleReplySubmit}
        isSubmitting={busy}
        api={api}
      />
      <AdminEditDrawer
        open={!!editThread}
        onOpenChange={(open) => { if (!open) setEditThread(null); }}
        thread={editThread}
        onSubmit={handleEditSubmit}
        isSubmitting={busy}
      />
      <AdminDeleteDrawer
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}
        onConfirm={handleDeleteConfirm}
        targetType="thread"
        isDeleting={busy}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// AdminUserLookup
// ---------------------------------------------------------------------------

function AdminUserLookup({ api }) {
  const [email, setEmail] = React.useState("");
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [revoking, setRevoking] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.lookupUser(trimmed);
      setResult(data);
    } catch (err) {
      setError(err.message || "Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!result) return;
    setRevoking(true);
    try {
      await api.revokeUser(result.user_id || email.trim());
      setResult((r) => r ? { ...r, is_revoked: true } : r);
    } catch (err) {
      alert("Revoke failed: " + (err.message || "Unknown error"));
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Search by email address..."
            type="email"
          />
        </div>
        <Button type="submit" disabled={loading || !email.trim()} style={{ backgroundColor: "#e62223", color: "#fff" }}>
          {loading ? "Searching..." : "Lookup"}
        </Button>
      </form>

      {error && (
        <Card style={{ borderColor: "#dc2626", marginBottom: "16px" }}>
          <CardContent style={{ padding: "12px", color: "#dc2626" }}>
            {error}
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "16px" }}>
              {result.email}
              {result.is_admin && (
                <Badge style={{ marginLeft: "8px", backgroundColor: "#e62223", color: "#fff" }}>Admin</Badge>
              )}
              {result.is_revoked && (
                <Badge variant="outline" style={{ marginLeft: "8px", color: "#dc2626", borderColor: "#dc2626" }}>Revoked</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px" }}>
              <div>
                <span style={{ color: "#888" }}>Admin name: </span>
                <strong>{result.admin_display_name || "N/A"}</strong>
              </div>
              <div>
                <span style={{ color: "#888" }}>Status: </span>
                <strong>{result.is_revoked ? "Revoked" : "Active"}</strong>
              </div>
            </div>
            {result.note && (
              <p style={{ fontSize: "12px", color: "#888", marginTop: "12px" }}>{result.note}</p>
            )}
          </CardContent>
          {!result.is_admin && !result.is_revoked && (
            <CardFooter>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRevoke}
                disabled={revoking}
                style={{ backgroundColor: "#dc2626" }}
              >
                {revoking ? "Revoking..." : "Revoke Token (8-day ban)"}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ForumAdmin (root component)
// ---------------------------------------------------------------------------

export function ForumAdmin({ config, api, navigate }) {
  const [activeTab, setActiveTab] = React.useState("dashboard");

  return (
    <div className="tpu-forum" style={{ maxWidth: 960, margin: "0 auto" }}>
      {/* Admin mode banner */}
      <div style={ADMIN_BANNER_STYLE}>
        <span>Admin Mode</span>
        <Button variant="ghost" size="sm" onClick={() => navigate("/forum")} style={{ fontSize: "12px" }}>
          Back to Forum
        </Button>
      </div>

      {/* Tab navigation */}
      <div style={{ padding: "16px 0 0" }}>
        <div style={TAB_BAR_STYLE}>
          <AdminTab active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </AdminTab>
          <AdminTab active={activeTab === "threads"} onClick={() => setActiveTab("threads")}>
            Threads
          </AdminTab>
          <AdminTab active={activeTab === "users"} onClick={() => setActiveTab("users")}>
            Users
          </AdminTab>
        </div>
      </div>

      {/* Tab content */}
      <div style={{ padding: "0 0 32px" }}>
        {activeTab === "dashboard" && <AdminDashboard api={api} navigate={navigate} />}
        {activeTab === "threads" && <AdminThreadList api={api} navigate={navigate} />}
        {activeTab === "users" && <AdminUserLookup api={api} />}
      </div>
    </div>
  );
}
