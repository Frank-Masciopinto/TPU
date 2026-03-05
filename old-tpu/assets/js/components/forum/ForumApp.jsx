import React from "react";

import { Alert, AlertDescription, AlertTitle } from "../ui/Alert";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Input } from "../ui/Input";
import { Progress } from "../ui/Progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/Sheet";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";
import { Textarea } from "../ui/Textarea";
import { ToggleGroup, ToggleGroupItem } from "../ui/ToggleGroup";

// Google Icon component
function GoogleIcon({ size = 18, className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        flexShrink: 0,
        display: "block",
      }}
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

import { signInWithGoogle, signOut as supabaseSignOut } from "../../lib/supabase";
import { forumApi, getAuth } from "./forumApi";
import { sanitizeUserHtml } from "./forumSanitize";
import { clearForumSeo, setForumFeedTitle, setForumThreadSeo } from "./forumSeo";

function isForumPath(pathname) {
  const p = (pathname || "").replace(/\/+$/, "");
  return p === "/forum" || p === "/forum/thread";
}

function parseRoute(loc) {
  const pathname = loc.pathname || "";
  const search = new URLSearchParams(loc.search || "");

  if (pathname.startsWith("/forum/thread")) {
    const slug = search.get("slug") || "";
    const threadId = search.get("t") || "";
    return { name: "thread", threadId, slug };
  }
  if (pathname.startsWith("/forum")) {
    return {
      name: "feed",
      q: search.get("q") || "",
      sort: search.get("sort") || "hot",
      filter: search.get("filter") || "",
      page: Math.max(1, parseInt(search.get("page") || "1", 10)),
    };
  }
  return { name: "feed", q: "", sort: "hot", filter: "", page: 1 };
}

function buildFeedUrl(state) {
  const p = new URLSearchParams();
  if (state.q) p.set("q", state.q);
  if (state.sort && state.sort !== "hot") p.set("sort", state.sort);
  if (state.filter) p.set("filter", state.filter);
  if (state.page && state.page !== 1) p.set("page", String(state.page));
  const qs = p.toString();
  return qs ? `/forum?${qs}` : "/forum";
}

function buildThreadUrl(threadOrId, slug) {
  if (slug) return `/forum/thread?slug=${encodeURIComponent(slug)}`;
  const id = typeof threadOrId === "object" ? (threadOrId.slug || threadOrId.id) : threadOrId;
  if (id && typeof id === "string" && !id.match(/^[0-9a-f-]{36}$/i)) {
    return `/forum/thread?slug=${encodeURIComponent(id)}`;
  }
  return `/forum/thread?t=${encodeURIComponent(id)}`;
}

function useRouter() {
  const [route, setRoute] = React.useState(() => parseRoute(window.location));

  React.useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const navigate = React.useCallback((url) => {
    if (!url) return;
    if (!isForumPath(new URL(url, window.location.origin).pathname)) {
      window.location.assign(url);
      return;
    }
    window.history.pushState({}, "", url);
    setRoute(parseRoute(window.location));
  }, []);

  return { route, navigate };
}

function ChevronUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l4-4 4 4" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function VoteWidget({ score, onUpvote, onDownvote, disabled }) {
  return (
    <div className="tpu-forum__vote">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onUpvote}
        disabled={disabled}
        aria-label="Upvote"
      >
        <ChevronUpIcon />
      </Button>
      <Badge variant="secondary" className="tpu-forum__vote-score">
        {typeof score === "number" ? score : 0}
      </Badge>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onDownvote}
        disabled={disabled}
        aria-label="Downvote"
      >
        <ChevronDownIcon />
      </Button>
    </div>
  );
}

function LoadingCard({ label }) {
  const [value, setValue] = React.useState(25);
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setValue((v) => (v >= 90 ? 30 : v + 10));
    }, 450);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">{label}</CardTitle>
        <CardDescription>Please wait…</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={value} />
      </CardContent>
    </Card>
  );
}

function ErrorState({ title, message, onRetry }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
        <div className="tpu-forum__actions">
          <Button type="button" variant="secondary" onClick={onRetry}>
            Retry
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <Alert variant="default">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {message}
        {onAction && (
          <div className="tpu-forum__actions">
            <Button type="button" variant="secondary" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}

function SignInDrawer({ open, onOpenChange, loginUrl, googleLoginUrl }) {
  const [isLoading, setIsLoading] = React.useState(false);

  // Get the current forum URL to return to after login
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "/forum";
  const returnPath =
    typeof window !== "undefined"
      ? window.location.pathname + window.location.search
      : "/forum";

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("[Auth:Sync] google-oauth-start");
      try { window.sessionStorage.setItem("tpu_bc_sync_pending", String(Date.now())); } catch (e) {}
      await signInWithGoogle(returnPath);
    } catch (error) {
      console.error("[Auth:Sync] google-oauth-error:", error);
      setIsLoading(false);
    }
  };

  // Construct login URL with return parameter so user comes back to forum after login
  const loginUrlWithReturn = `${loginUrl}?from=${encodeURIComponent(currentUrl)}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Sign in to participate</SheetTitle>
          <SheetDescription>
            You can read the forum anonymously, but you'll need an account to
            post, vote, or reply.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            width: "100%",
          }}
        >
          <Button
            type="button"
            variant="default"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              backgroundColor: "#4285f4",
              borderColor: "#4285f4",
              color: "#ffffff",
            }}
          >
            <GoogleIcon size={18} />
            {isLoading ? "Redirecting..." : "Login with Google"}
          </Button>
          <a
            href={loginUrlWithReturn}
            className="tpu-forum__link"
            style={{ width: "100%" }}
          >
            <Button type="button" variant="secondary" style={{ width: "100%" }}>
              Go to Login
            </Button>
          </a>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function validateTags(tags) {
  const errors = {};

  const trailerType = (tags.trailerType || "").trim();
  const allowedTrailerTypes = ["Boat", "RV", "Utility"];
  if (!allowedTrailerTypes.includes(trailerType)) {
    errors.trailerType = "Trailer type is required.";
  }

  const allowedCapacities = [
    "2000",
    "3500",
    "5200",
    "6000",
    "7000",
    "8000",
    "10000",
    "12000",
  ];
  if (!allowedCapacities.includes(tags.capacity)) {
    errors.capacity = "Capacity is required.";
  }

  const allowedAxleCounts = ["1", "2", "3"];
  if (!allowedAxleCounts.includes(tags.axleCount)) {
    errors.axleCount = "Axle count is required.";
  }

  const allowedBoltPatterns = [
    "4 on 4",
    "5 on 4.5",
    "5 on 5",
    "5 on 5.5",
    "6 on 5.5",
    "8 on 6.5",
  ];
  if (!allowedBoltPatterns.includes(tags.boltPattern)) {
    errors.boltPattern = "Bolt pattern is required.";
  }

  const brakeType = (tags.brakeType || "").trim();
  const allowedBrakeTypes = ["Electric", "Hydraulic", "None"];
  if (!allowedBrakeTypes.includes(brakeType)) {
    errors.brakeType = "Brake type is required.";
  }

  return errors;
}

function AskQuestionDrawer({ open, onOpenChange, onSubmit, submitting }) {
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tags, setTags] = React.useState({
    trailerType: "Utility",
    capacity: "3500",
    axleCount: "1",
    boltPattern: "5 on 4.5",
    brakeType: "Electric",
  });
  const [errors, setErrors] = React.useState({});

  React.useEffect(() => {
    if (!open) {
      setErrors({});
    }
  }, [open]);

  const submit = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = "Title is required.";
    if (!body.trim()) nextErrors.body = "Body is required.";

    const tagErrors = validateTags(tags);
    Object.assign(nextErrors, tagErrors);

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSubmit({ title: title.trim(), body: body.trim(), tags });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Ask a question</SheetTitle>
          <SheetDescription>
            Share enough detail so the community can help you fast.
          </SheetDescription>
        </SheetHeader>

        <div className="tpu-forum__drawer-body">
          <Card>
            <CardHeader>
              <CardTitle as="h3">Question</CardTitle>
              <CardDescription>Title and details</CardDescription>
            </CardHeader>
            <CardContent className="tpu-forum__form">
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title)
                    setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Title"
              />
              {errors.title && (
                <Badge variant="destructive">{errors.title}</Badge>
              )}
              <Textarea
                value={body}
                onChange={(e) => {
                  setBody(e.target.value);
                  if (errors.body)
                    setErrors((prev) => ({ ...prev, body: undefined }));
                }}
                placeholder="Describe the problem, measurements, symptoms, etc."
              />
              {errors.body && (
                <Badge variant="destructive">{errors.body}</Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle as="h3">Structured tags</CardTitle>
              <CardDescription>
                These help us route and rank answers.
              </CardDescription>
            </CardHeader>
            <CardContent className="tpu-forum__form">
              <Select
                value={tags.trailerType}
                onValueChange={(v) => {
                  setTags((t) => ({ ...t, trailerType: v }));
                  if (errors.trailerType)
                    setErrors((prev) => ({ ...prev, trailerType: undefined }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Trailer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Boat">Boat</SelectItem>
                  <SelectItem value="RV">RV</SelectItem>
                  <SelectItem value="Utility">Utility</SelectItem>
                </SelectContent>
              </Select>
              {errors.trailerType && (
                <Badge variant="destructive">{errors.trailerType}</Badge>
              )}

              <Select
                value={tags.capacity}
                onValueChange={(v) => {
                  setTags((t) => ({ ...t, capacity: v }));
                  if (errors.capacity)
                    setErrors((prev) => ({ ...prev, capacity: undefined }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Capacity (lbs)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2000">2,000 lbs</SelectItem>
                  <SelectItem value="3500">3,500 lbs</SelectItem>
                  <SelectItem value="5200">5,200 lbs</SelectItem>
                  <SelectItem value="6000">6,000 lbs</SelectItem>
                  <SelectItem value="7000">7,000 lbs</SelectItem>
                  <SelectItem value="8000">8,000 lbs</SelectItem>
                  <SelectItem value="10000">10,000 lbs</SelectItem>
                  <SelectItem value="12000">12,000 lbs</SelectItem>
                </SelectContent>
              </Select>
              {errors.capacity && (
                <Badge variant="destructive">{errors.capacity}</Badge>
              )}

              <Select
                value={tags.axleCount}
                onValueChange={(v) => {
                  setTags((t) => ({ ...t, axleCount: v }));
                  if (errors.axleCount)
                    setErrors((prev) => ({ ...prev, axleCount: undefined }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Axle Count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Axle</SelectItem>
                  <SelectItem value="2">2 Axles (Tandem)</SelectItem>
                  <SelectItem value="3">3 Axles (Triple)</SelectItem>
                </SelectContent>
              </Select>
              {errors.axleCount && (
                <Badge variant="destructive">{errors.axleCount}</Badge>
              )}

              <Select
                value={tags.boltPattern}
                onValueChange={(v) => {
                  setTags((t) => ({ ...t, boltPattern: v }));
                  if (errors.boltPattern)
                    setErrors((prev) => ({ ...prev, boltPattern: undefined }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bolt Pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4 on 4">4 on 4</SelectItem>
                  <SelectItem value="5 on 4.5">5 on 4.5</SelectItem>
                  <SelectItem value="5 on 5">5 on 5</SelectItem>
                  <SelectItem value="5 on 5.5">5 on 5.5</SelectItem>
                  <SelectItem value="6 on 5.5">6 on 5.5</SelectItem>
                  <SelectItem value="8 on 6.5">8 on 6.5</SelectItem>
                </SelectContent>
              </Select>
              {errors.boltPattern && (
                <Badge variant="destructive">{errors.boltPattern}</Badge>
              )}

              <Select
                value={tags.brakeType}
                onValueChange={(v) => {
                  setTags((t) => ({ ...t, brakeType: v }));
                  if (errors.brakeType)
                    setErrors((prev) => ({ ...prev, brakeType: undefined }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Brake Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Hydraulic">Hydraulic</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
              {errors.brakeType && (
                <Badge variant="destructive">{errors.brakeType}</Badge>
              )}
            </CardContent>
          </Card>
        </div>

        <SheetFooter>
          <Button type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ReplyDrawer({ open, onOpenChange, onSubmit, submitting, title }) {
  const [body, setBody] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setBody("");
      setError("");
    }
  }, [open]);

  const submit = () => {
    if (!body.trim()) {
      setError("Reply cannot be empty.");
      return;
    }
    onSubmit({ body: body.trim() });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{title || "Reply"}</SheetTitle>
          <SheetDescription>
            Keep it specific and include measurements if relevant.
          </SheetDescription>
        </SheetHeader>
        <div className="tpu-forum__drawer-body">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your reply…"
          />
          {error && <Badge variant="destructive">{error}</Badge>}
        </div>
        <SheetFooter>
          <Button type="button" onClick={submit} disabled={submitting}>
            {submitting ? "Posting…" : "Post Reply"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ThreadCard({
  thread,
  onOpen,
  onVote,
  canInteract,
  onDelete,
  showDelete,
}) {
  const tags = Array.isArray(thread.tags) ? thread.tags : [];
  const answered = !!(
    thread.acceptedAnswerId ||
    thread.accepted_answer_id ||
    thread.hasAcceptedAnswer ||
    thread.answered ||
    thread.accepted_comment_id
  );

  const cardStyle = {
    background: "var(--tpu-bg-secondary)",
    border: "1px solid transparent",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "0",
    boxShadow: "var(--tpu-shadow-sm)",
  };
  const titleStyle = {
    color: "var(--tpu-accent-primary)",
    fontSize: "18px",
    fontWeight: 600,
    cursor: "pointer",
    background: "none",
    border: "none",
    textAlign: "left",
    padding: 0,
  };
  const descStyle = {
    color: "var(--tpu-text-tertiary)",
    fontSize: "14px",
    marginTop: "8px",
  };
  const badgeStyle = {
    display: "inline-block",
    background: "var(--tpu-bg-tertiary)",
    color: "var(--tpu-text-secondary)",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    marginRight: "8px",
    marginTop: "8px",
  };
  const successBadgeStyle = {
    ...badgeStyle,
    background: "rgba(22, 163, 74, 0.12)",
    color: "#15803d",
    fontWeight: 600,
  };
  const footerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
    paddingTop: "12px",
    borderTop: "1px solid var(--tpu-border-secondary)",
  };

  return (
    <div style={cardStyle} className="tpu-forum__thread-card tpu-card">
      <div>
        <button type="button" style={titleStyle} onClick={onOpen}>
          {thread.title || "Untitled"}
        </button>
        <p style={descStyle}>
          {thread.excerpt || thread.body?.substring(0, 150) || ""}
        </p>
      </div>
      <div>
        {answered && <span style={successBadgeStyle}>Answered</span>}
        {tags.slice(0, 6).map((t) => (
          <span key={String(t)} style={badgeStyle}>
            {String(t)}
          </span>
        ))}
      </div>
      <div style={footerStyle}>
        <VoteWidget
          score={thread.votes ?? thread.score ?? 0}
          disabled={!canInteract}
          onUpvote={() => onVote(1)}
          onDownvote={() => onVote(-1)}
        />
        <div className="tpu-forum__thread-footer-actions">
          <span style={badgeStyle}>
            {typeof thread.commentCount === "number"
              ? thread.commentCount
              : thread.comment_count || thread.comments || 0}{" "}
            comments
          </span>
          {showDelete && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmDrawer({
  open,
  onOpenChange,
  onConfirm,
  targetType,
  isDeleting,
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Confirm Delete</SheetTitle>
          <SheetDescription>
            Are you sure you want to delete this {targetType}? This action
            cannot be undone.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
          }}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function CommentCard({
  comment,
  depth,
  onReply,
  onVote,
  canInteract,
  isAccepted,
  isAuthorAdmin,
  onDelete,
  showDelete,
}) {
  const bodyHtml = sanitizeUserHtml(comment.bodyHtml || comment.body || "");
  const authorName = comment.author || comment.authorName || "Member";

  // Determine CSS classes
  const cardClasses = [
    "tpu-forum__comment",
    depth === 1 ? "tpu-forum__comment--child" : "",
    isAuthorAdmin ? "tpu-forum__comment--admin" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className={cardClasses}>
      <CardHeader>
        <CardTitle as="h4">
          {isAccepted ? <Badge variant="success">Accepted</Badge> : null}{" "}
          {isAuthorAdmin ? (
            <Badge className="tpu-forum__badge--admin">TPU Admin</Badge>
          ) : (
            <Badge variant="outline">{authorName}</Badge>
          )}
        </CardTitle>
        <CardDescription>
          {comment.createdAt || comment.created_at || ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="tpu-forum__richtext"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </CardContent>
      <CardFooter className="tpu-forum__comment-footer">
        <VoteWidget
          score={comment.votes ?? comment.score ?? 0}
          disabled={!canInteract}
          onUpvote={() => onVote(1)}
          onDownvote={() => onVote(-1)}
        />
        <div className="tpu-forum__comment-actions">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onReply}
            disabled={!canInteract}
          >
            Reply
          </Button>
          {showDelete && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onDelete}
            >
              Delete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

const PRODUCT_LINKS = [
  { keywords: ["3500", "3.5k", "3500 lb"], label: "3,500 lb Trailer Axles", url: "/axles/?brand=120&sort=featured" },
  { keywords: ["5200", "5.2k", "5200 lb"], label: "5,200 lb Trailer Axles", url: "/axles/?brand=120&sort=featured" },
  { keywords: ["6000", "6k axle", "6000 lb"], label: "6,000 lb Trailer Axles", url: "/axles/?brand=120&sort=featured" },
  { keywords: ["7000", "7k axle", "7k trailer"], label: "7,000 lb Trailer Axles", url: "/axles/" },
  { keywords: ["8000", "8k axle", "8k trailer"], label: "8,000 lb Trailer Axles", url: "/axles/" },
  { keywords: ["10000", "10k axle", "10k trailer"], label: "10,000 lb Trailer Axles", url: "/axles/" },
  { keywords: ["12000", "12k axle", "12k trailer"], label: "12,000 lb Trailer Axles", url: "/axles/" },
  { keywords: ["hub and drum", "hub drum", "hub & drum"], label: "Trailer Hubs & Drums", url: "/trailer-axle-parts/hubs-drums/" },
  { keywords: ["bearing", "bearings", "repack"], label: "Trailer Bearings & Seal Kits", url: "/trailer-axle-parts/bearings-races-seals-kits/" },
  { keywords: ["brake assembly", "electric brake", "brake magnet"], label: "Trailer Brake Assemblies", url: "/trailer-axle-parts/trailer-brakes/" },
  { keywords: ["leaf spring", "slipper spring", "double eye spring"], label: "Trailer Leaf Springs", url: "/trailer-suspension/leaf-springs/" },
  { keywords: ["hanger kit", "suspension kit", "equalizer"], label: "Trailer Suspension Kits", url: "/trailer-suspension/" },
  { keywords: ["tire", "tires", "wheel", "wheels", "17.5", "16 inch", "15 inch"], label: "Trailer Tires & Wheels", url: "/tires-wheels/" },
  { keywords: ["tandem axle kit", "tandem kit"], label: "Tandem Axle Kits", url: "/trailer-axle-kits/" },
  { keywords: ["hutch", "hdss"], label: "Hutch HDSS Suspension", url: "/trailer-suspension/" },
  { keywords: ["grease cap", "oil cap", "oil bath"], label: "Oil & Grease Caps", url: "/trailer-axle-parts/oil-grease-caps/" },
  { keywords: ["u-bolt", "u bolt"], label: "U-Bolt Kits", url: "/trailer-suspension/u-bolts-kits/" },
  { keywords: ["lug nut", "stud", "swivel flange"], label: "Wheel Studs & Lug Nuts", url: "/tires-wheels/wheel-accessories-parts/" },
  { keywords: ["disc brake", "hydraulic brake", "caliper"], label: "Hydraulic Disc Brakes", url: "/trailer-axle-parts/trailer-brakes/" },
  { keywords: ["coupler", "gooseneck", "hitch"], label: "Trailer Couplers & Hitches", url: "/towing-accessories/" },
];

function RelatedProducts({ thread }) {
  if (!thread) return null;
  const text = ((thread.title || "") + " " + (thread.body || "") + " " + (thread.tags || []).join(" ")).toLowerCase();
  const matches = PRODUCT_LINKS.filter((p) =>
    p.keywords.some((kw) => text.includes(kw))
  ).slice(0, 5);

  if (!matches.length) return null;

  return (
    <Card className="tpu-forum__related-products">
      <CardHeader>
        <h2 className="tpu-forum__section-heading">Related Products</h2>
      </CardHeader>
      <CardContent>
        <ul className="tpu-forum__product-links">
          {matches.map((m) => (
            <li key={m.url}>
              <a href={m.url}>{m.label}</a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ForumApp({ config }) {
  const { route, navigate } = useRouter();
  const api = React.useMemo(() => forumApi(config), [config]);

  const loginUrl =
    (config && (config.loginUrl || config.loginURL)) || "/login.php";
  const googleLoginUrl =
    (config && (config.googleLoginUrl || config.googleLoginURL)) || null;

  const [signInOpen, setSignInOpen] = React.useState(false);
  const [askOpen, setAskOpen] = React.useState(false);
  const [replyOpen, setReplyOpen] = React.useState(false);
  const [replyParentId, setReplyParentId] = React.useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState(null); // { type: 'thread'|'comment', id: string }

  // Auth state - use state so we can refresh when user returns to tab after login
  const [auth, setAuth] = React.useState(() => getAuth(config));
  const canInteract = !!auth.token;

  const logoutUrl = (config && config.logoutUrl) || "/login.php?action=logout";

  const handleForumSignOut = React.useCallback(async () => {
    console.log("[Auth:Sync] sign-out-start");
    try { await supabaseSignOut(); } catch (e) { /* best effort */ }
    try {
      window.localStorage.removeItem("tpu_forum_token");
      window.localStorage.removeItem("tpuForumToken");
      window.localStorage.removeItem("forumToken");
      var keys = [];
      for (var i = 0; i < window.localStorage.length; i++) keys.push(window.localStorage.key(i));
      keys.forEach(function(k) {
        if (k.indexOf("sb-") === 0 && k.indexOf("-auth-token") !== -1) window.localStorage.removeItem(k);
      });
    } catch (e) { /* ignore */ }
    try { window.sessionStorage.removeItem("tpu_bc_sync_pending"); } catch (e) {}
    setAuth({ token: null, user: null });
    console.log("[Auth:Sync] sign-out-complete, redirecting to BC logout");
    window.location.href = logoutUrl;
  }, [logoutUrl]);

  // BC sync overlay state (M1)
  const [bcSyncState, setBcSyncState] = React.useState(null); // null | 'syncing' | 'failed'

  // Admin state
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [adminDisplayName, setAdminDisplayName] = React.useState(null);
  const [adminList, setAdminList] = React.useState({}); // { email: displayName }

  // Re-check auth immediately on mount (in case token was set just before render)
  React.useEffect(() => {
    const currentAuth = getAuth(config);
    if (currentAuth.token !== auth.token) {
      console.log(
        "[Forum] Auth state updated on mount:",
        currentAuth.token ? "logged in" : "logged out",
      );
      setAuth(currentAuth);
    }
  }, []); // Only run once on mount

  // M1: Auto-sync Google OAuth to BC session
  React.useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("auth_complete")) {
      console.log("[Auth:Sync] auth_complete detected in ForumApp");
      url.searchParams.delete("auth_complete");
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
      try { window.sessionStorage.removeItem("tpu_bc_sync_pending"); } catch (e) {}
      setBcSyncState(null);
      return;
    }

    let pending;
    try { pending = window.sessionStorage.getItem("tpu_bc_sync_pending"); } catch (e) {}
    if (!pending) return;

    const pendingTs = parseInt(pending, 10);
    if (isNaN(pendingTs) || Date.now() - pendingTs > 60000) {
      console.log("[Auth:Sync] stale tpu_bc_sync_pending, clearing");
      try { window.sessionStorage.removeItem("tpu_bc_sync_pending"); } catch (e) {}
      return;
    }

    const currentAuth = getAuth(config);
    if (!currentAuth.token) return;
    const bcCustomer = config && config.customer;
    if (bcCustomer && bcCustomer.id) return;

    console.log("[Auth:Sync] bc-sync-start: have Supabase token, no BC session");
    setBcSyncState("syncing");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const authApiBase = (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"))
      ? "http://localhost:8787"
      : "https://cartertraileraxles.com";

    fetch(`${authApiBase}/auth/bc-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentAuth.token}`,
      },
      body: JSON.stringify({ redirect_to: "/forum?auth_complete=1" }),
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeout);
        if (!res.ok) throw new Error("bc-login failed: " + res.status);
        return res.json();
      })
      .then((data) => {
        if (data.login_url) {
          console.log("[Auth:Sync] bc-sync-redirect");
          window.location.href = data.login_url;
        } else {
          throw new Error("no login_url returned");
        }
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.warn("[Auth:Sync] bc-sync-timeout-or-error:", err.message);
        try { window.sessionStorage.removeItem("tpu_bc_sync_pending"); } catch (e) {}
        setBcSyncState("failed");
      });
  }, []); // Only run once on mount

  // Fetch admin status when authenticated
  React.useEffect(() => {
    if (!auth.token) {
      setIsAdmin(false);
      setAdminDisplayName(null);
      return;
    }

    api
      .getAdminStatus()
      .then((res) => {
        setIsAdmin(res.isAdmin || false);
        setAdminDisplayName(res.displayName || null);
        console.log(
          "[Forum] Admin status:",
          res.isAdmin ? "admin" : "member",
          res.displayName,
        );
      })
      .catch((e) => {
        console.warn("[Forum] Failed to fetch admin status:", e.message);
        setIsAdmin(false);
        setAdminDisplayName(null);
      });
  }, [api, auth.token]);

  // Fetch admin list for badge display (public endpoint)
  React.useEffect(() => {
    api
      .getAdminList()
      .then((res) => {
        setAdminList(res.admins || {});
        console.log(
          "[Forum] Loaded admin list:",
          Object.keys(res.admins || {}).length,
          "admins",
        );
      })
      .catch((e) => {
        console.warn("[Forum] Failed to fetch admin list:", e.message);
      });
  }, [api]);

  // Re-check auth when page becomes visible (user may have logged in in another tab)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const newAuth = getAuth(config);
        // Only update if auth state actually changed
        if (newAuth.token !== auth.token) {
          console.log(
            "[Forum] Auth state changed on visibility:",
            newAuth.token ? "logged in" : "logged out",
          );
          setAuth(newAuth);
          // Close sign-in drawer if user just logged in
          if (newAuth.token && signInOpen) {
            setSignInOpen(false);
          }
        }
      }
    };

    // Also check on focus (covers more cases)
    const handleFocus = () => {
      const newAuth = getAuth(config);
      if (newAuth.token !== auth.token) {
        console.log(
          "[Forum] Auth state changed on focus:",
          newAuth.token ? "logged in" : "logged out",
        );
        setAuth(newAuth);
        if (newAuth.token && signInOpen) {
          setSignInOpen(false);
        }
      }
    };

    // Listen for localStorage changes (token exchange, login from another tab, etc.)
    const handleStorage = (event) => {
      // Check if a forum-related token was changed
      if (
        event.key &&
        (event.key === "tpu_forum_token" ||
          event.key === "tpuForumToken" ||
          event.key === "forumToken" ||
          (event.key.startsWith("sb-") && event.key.endsWith("-auth-token")))
      ) {
        const newAuth = getAuth(config);
        if (newAuth.token !== auth.token) {
          console.log(
            "[Forum] Auth state changed via storage event:",
            newAuth.token ? "logged in" : "logged out",
          );
          setAuth(newAuth);
          if (newAuth.token && signInOpen) {
            setSignInOpen(false);
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [config, auth.token, signInOpen]);

  // Feed state
  const [feed, setFeed] = React.useState({
    items: [],
    page: 1,
    hasMore: false,
  });
  const feedKeyRef = React.useRef("");
  const [feedLoading, setFeedLoading] = React.useState(false);
  const [feedError, setFeedError] = React.useState(null);
  const [feedQuery, setFeedQuery] = React.useState(
    route.name === "feed" ? route.q : "",
  );
  const [feedSort, setFeedSort] = React.useState(
    route.name === "feed" ? route.sort : "hot",
  );
  const [feedFilter, setFeedFilter] = React.useState(
    route.name === "feed" ? route.filter || "all" : "all",
  );

  // Thread state
  const [threadLoading, setThreadLoading] = React.useState(false);
  const [threadError, setThreadError] = React.useState(null);
  const [thread, setThread] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [commentSort, setCommentSort] = React.useState("best");
  const [posting, setPosting] = React.useState(false);

  // Sync controls when URL changes
  React.useEffect(() => {
    if (route.name !== "feed") return;
    setFeedQuery(route.q || "");
    setFeedSort(route.sort || "hot");
    setFeedFilter(route.filter || "all");
  }, [route]);

  // Load feed
  React.useEffect(() => {
    if (route.name !== "feed") return;
    setForumFeedTitle(route);

    let cancelled = false;
    setFeedLoading(true);
    setFeedError(null);

    const page = route.page || 1;
    const key = `${route.q || ""}::${route.sort || "hot"}::${route.filter || ""}`;
    const shouldAppend = feedKeyRef.current === key && page > 1;

    if (!shouldAppend) {
      feedKeyRef.current = key;
      setFeed((prev) => ({ ...prev, items: [], page: 1, hasMore: false }));
    }

    api
      .listThreads({
        q: route.q,
        sort: route.sort,
        filter: route.filter,
        page,
        pageSize: 10,
      })
      .then((data) => {
        console.log("[ForumApp] listThreads response:", data);
        if (cancelled) return;
        const itemsRaw =
          (data && (data.data || data.items || data.threads)) || [];
        const items = Array.isArray(itemsRaw) ? itemsRaw : [];
        console.log("[ForumApp] Extracted items:", items.length, "items");
        const hasMore = Boolean(
          data && (data.hasMore || data.has_more || data.nextPage != null),
        );
        if (shouldAppend) {
          setFeed((prev) => ({
            items: [...(prev.items || []), ...items],
            page,
            hasMore,
          }));
        } else {
          setFeed({ items, page, hasMore });
        }
        console.log("[ForumApp] Feed state updated");
      })
      .catch((e) => {
        if (cancelled) return;
        setFeedError(e);
      })
      .finally(() => {
        if (!cancelled) setFeedLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [api, route]);

  // Load thread + comments
  React.useEffect(() => {
    if (route.name !== "thread") return;
    if (!route.threadId && !route.slug) return;

    let cancelled = false;
    setThreadLoading(true);
    setThreadError(null);
    setThread(null);
    setComments([]);

    const threadPromise = route.slug
      ? api.getThreadBySlug(route.slug)
      : api.getThread(route.threadId);

    threadPromise.then((t) => {
      const threadObj = (t && (t.thread || t.data || t)) || null;
      if (cancelled) return threadObj;

      // If user arrived via ?t=uuid but thread has a slug, redirect to slug URL
      if (route.threadId && !route.slug && threadObj && threadObj.slug) {
        const slugUrl = buildThreadUrl(null, threadObj.slug);
        window.history.replaceState({}, "", slugUrl);
      }

      const resolvedId = threadObj && (threadObj.id || route.threadId);
      return Promise.all([
        Promise.resolve(t),
        resolvedId ? api.listComments(resolvedId, commentSort) : Promise.resolve({ data: [] }),
      ]);
    }).then((result) => {
      if (cancelled || !result) return;
      const [t, c] = result;
      const threadObj = (t && (t.thread || t.data || t)) || null;
      const commentItemsRaw =
        (c && (c.data || c.items || c.comments || c)) || [];
      const commentItems = Array.isArray(commentItemsRaw)
        ? commentItemsRaw
        : [];
      setThread(threadObj);
      setComments(commentItems);

      const acceptedId =
        threadObj &&
        (threadObj.acceptedAnswerId ||
          threadObj.accepted_comment_id ||
          threadObj.acceptedCommentId);
      const accepted = acceptedId
        ? commentItems.find((x) => String(x.id) === String(acceptedId))
        : null;
      const suggested = commentItems.filter(
        (x) => !acceptedId || String(x.id) !== String(acceptedId),
      );
      setForumThreadSeo(threadObj, accepted, suggested.slice(0, 5));
    })
    .catch((e) => {
      if (cancelled) return;
      setThreadError(e);
    })
    .finally(() => {
      if (!cancelled) setThreadLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [api, route, commentSort]);

  const requireAuth = React.useCallback(() => {
    if (canInteract) return true;
    setSignInOpen(true);
    return false;
  }, [canInteract]);

  // Admin delete handlers
  const confirmDelete = React.useCallback((type, id) => {
    setDeleteTarget({ type, id });
    setDeleteConfirmOpen(true);
  }, []);

  const executeDelete = React.useCallback(async () => {
    if (!deleteTarget) return;

    const { type, id } = deleteTarget;
    setPosting(true);

    try {
      if (type === "thread") {
        await api.deleteThread(id);
        // Navigate back to feed after deleting thread
        navigate("/forum");
      } else if (type === "comment") {
        await api.deleteComment(id);
        // Remove comment from local state
        setComments((prev) => prev.filter((c) => String(c.id) !== String(id)));
      }
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
    } catch (e) {
      console.error("[Forum] Delete failed:", e.message);
      alert("Failed to delete: " + (e.message || "Unknown error"));
    } finally {
      setPosting(false);
    }
  }, [api, deleteTarget, navigate]);

  const submitThread = async (payload) => {
    if (!requireAuth()) return;
    setPosting(true);
    try {
      const created = await api.createThread(payload);
      const createdThread = (created && (created.thread || created)) || null;
      if (createdThread && (createdThread.slug || createdThread.id)) {
        setAskOpen(false);
        navigate(buildThreadUrl(createdThread, createdThread.slug));
      } else {
        // fallback: just refresh feed
        setAskOpen(false);
        navigate(buildFeedUrl({ q: "", sort: "hot", filter: "", page: 1 }));
      }
    } catch (e) {
      setSignInOpen(true);
    } finally {
      setPosting(false);
    }
  };

  const submitReply = async ({ body }) => {
    if (!requireAuth()) return;
    if (!thread || !thread.id) return;
    setPosting(true);
    try {
      await api.createComment(thread.id, {
        body,
        parentId: replyParentId || null,
      });
      setReplyOpen(false);
      setReplyParentId(null);
      // refresh comments
      const c = await api.listComments(thread.id, commentSort);
      const commentItemsRaw =
        (c && (c.data || c.items || c.comments || c)) || [];
      const commentItems = Array.isArray(commentItemsRaw)
        ? commentItemsRaw
        : [];
      setComments(commentItems);
    } catch (e) {
      setSignInOpen(true);
    } finally {
      setPosting(false);
    }
  };

  const voteThread = async (delta) => {
    if (!requireAuth()) return;
    if (!thread || !thread.id) return;
    try {
      const res = await api.voteThread(thread.id, delta);
      const nextVotes = (res && (res.votes || res.score)) ?? null;
      if (typeof nextVotes === "number")
        setThread((t) => ({ ...t, votes: nextVotes }));
    } catch (e) {
      setSignInOpen(true);
    }
  };

  const voteComment = async (commentId, delta) => {
    if (!requireAuth()) return;
    try {
      const res = await api.voteComment(commentId, delta);
      const nextVotes = (res && (res.votes || res.score)) ?? null;
      if (typeof nextVotes === "number") {
        setComments((prev) =>
          prev.map((c) =>
            String(c.id) === String(commentId) ? { ...c, votes: nextVotes } : c,
          ),
        );
      }
    } catch (e) {
      setSignInOpen(true);
    }
  };

  const onSearchSubmit = () => {
    const f = feedFilter === "all" ? "" : feedFilter;
    navigate(
      buildFeedUrl({ q: feedQuery, sort: feedSort, filter: f, page: 1 }),
    );
  };

  const onFilterChange = (value) => {
    const next = value || "all";
    const f = next === "all" ? "" : next;
    setFeedFilter(next);
    navigate(
      buildFeedUrl({ q: feedQuery, sort: feedSort, filter: f, page: 1 }),
    );
  };

  const onSortChange = (value) => {
    setFeedSort(value);
    const f = feedFilter === "all" ? "" : feedFilter;
    navigate(buildFeedUrl({ q: feedQuery, sort: value, filter: f, page: 1 }));
  };

  const loadMore = () => {
    const f = feedFilter === "all" ? "" : feedFilter;
    navigate(
      buildFeedUrl({
        q: feedQuery,
        sort: feedSort,
        filter: f,
        page: (feed.page || 1) + 1,
      }),
    );
  };

  const renderFeed = () => (
    <div className="tpu-forum__page">
      {/* Breadcrumb navigation */}
      <nav className="tpu-forum__breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Home</a></li>
          <li aria-current="page">Forum</li>
        </ol>
      </nav>

      <Card className="tpu-forum__header">
        <CardHeader>
          <h1 className="tpu-forum__feed-title">Trailer Q&amp;A Forum</h1>
          <CardDescription>
            Ask questions, share fixes, and get trailer-ready fast.
          </CardDescription>
        </CardHeader>
        <CardContent className="tpu-forum__toolbar">
          <div className="tpu-forum__search">
            <Input
              value={feedQuery}
              onChange={(e) => setFeedQuery(e.target.value)}
              placeholder="Search threads…"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearchSubmit();
              }}
            />
            <Button type="button" variant="secondary" onClick={onSearchSubmit}>
              Search
            </Button>
          </div>

          <div className="tpu-forum__filters">
            <Select value={feedSort} onValueChange={onSortChange}>
              <SelectTrigger className="tpu-forum__sort">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hot">Hot</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="top">Top</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
              </SelectContent>
            </Select>

            <ToggleGroup
              type="single"
              value={feedFilter}
              onValueChange={onFilterChange}
            >
              <ToggleGroupItem value="all">All</ToggleGroupItem>
              <ToggleGroupItem value="Boat">Boat</ToggleGroupItem>
              <ToggleGroupItem value="RV">RV</ToggleGroupItem>
              <ToggleGroupItem value="Utility">Utility</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardContent>
        <CardFooter className="tpu-forum__header-footer" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Button
            type="button"
            onClick={() =>
              canInteract ? setAskOpen(true) : setSignInOpen(true)
            }
          >
            Ask a question
          </Button>
          {canInteract && (
            <Button type="button" variant="outline" size="sm" onClick={handleForumSignOut}>
              Sign Out
            </Button>
          )}
        </CardFooter>
      </Card>

      {feedLoading && (feed.page || 1) === 1 && (
        <LoadingCard label="Loading threads" />
      )}
      {feedError && (
        <ErrorState
          title="Couldn’t load threads"
          message={feedError.message || "Please try again."}
          onRetry={() =>
            navigate(
              buildFeedUrl({
                q: feedQuery,
                sort: feedSort,
                filter: feedFilter,
                page: feed.page || 1,
              }),
            )
          }
        />
      )}
      {!feedLoading && !feedError && (!feed.items || !feed.items.length) && (
        <EmptyState
          title="No threads yet"
          message="Be the first to ask a question."
          actionLabel="Ask a question"
          onAction={() =>
            canInteract ? setAskOpen(true) : setSignInOpen(true)
          }
        />
      )}

      <div className="tpu-forum__list">
        {console.log(
          "[ForumApp] Rendering list, feed.items:",
          feed.items?.length || 0,
        )}
        {(feed.items || []).map((t) => {
          console.log("[ForumApp] Rendering ThreadCard for:", t.id, t.title);
          return (
            <ThreadCard
              key={String(t.id || t.threadId || t.slug || Math.random())}
              thread={{
                ...t,
                votes: t.votes ?? t.score ?? 0,
                excerpt: t.excerpt || t.summary || "",
                commentCount:
                  t.commentCount || t.comment_count || t.replies || 0,
              }}
              canInteract={canInteract}
              onOpen={() => navigate(buildThreadUrl(t, t.slug))}
              onVote={(delta) => {
                if (!requireAuth()) return;
                api
                  .voteThread(t.id, delta)
                  .catch(() => setSignInOpen(true));
              }}
            />
          );
        })}
      </div>

      {feedLoading && (feed.page || 1) > 1 && (
        <Card>
          <CardContent>
            <Progress value={55} />
          </CardContent>
        </Card>
      )}

      {!feedLoading && !feedError && feed.hasMore && (
        <div className="tpu-forum__loadmore">
          <Button type="button" variant="secondary" onClick={loadMore}>
            Load more
          </Button>
        </div>
      )}

      <AskQuestionDrawer
        open={askOpen}
        onOpenChange={setAskOpen}
        onSubmit={submitThread}
        submitting={posting}
      />
    </div>
  );

  const renderThread = () => {
    if (threadLoading) return <LoadingCard label="Loading thread" />;
    if (threadError) {
      return (
        <ErrorState
          title="Couldn’t load thread"
          message={threadError.message || "Please try again."}
          onRetry={() => navigate(buildThreadUrl(route.threadId, route.slug))}
        />
      );
    }
    if (!thread)
      return (
        <EmptyState
          title="Thread not found"
          message="This thread may have been removed."
        />
      );

    const tags = Array.isArray(thread.tags) ? thread.tags : [];
    const answered = !!(
      thread.acceptedAnswerId ||
      thread.accepted_comment_id ||
      thread.acceptedCommentId ||
      thread.answered
    );
    const threadBody = sanitizeUserHtml(thread.bodyHtml || thread.body || "");

    const acceptedId =
      thread.acceptedAnswerId ||
      thread.accepted_comment_id ||
      thread.acceptedCommentId;
    const byParent = new Map();
    (comments || []).forEach((c) => {
      const parent = c.parentId || c.parent_id || null;
      const key = parent ? String(parent) : "__root__";
      const arr = byParent.get(key) || [];
      arr.push(c);
      byParent.set(key, arr);
    });
    const allRootComments = byParent.get("__root__") || [];

    const accepted = acceptedId
      ? (comments || []).find((c) => String(c.id) === String(acceptedId))
      : null;

    // Exclude the accepted answer from the general list — it's shown in its own section
    const rootComments = accepted
      ? allRootComments.filter((c) => String(c.id) !== String(acceptedId))
      : allRootComments;

    return (
      <div className="tpu-forum__page">
        {/* Breadcrumb navigation */}
        <nav className="tpu-forum__breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="/">Home</a></li>
            <li><a href="/forum" onClick={(e) => { e.preventDefault(); navigate("/forum"); }}>Forum</a></li>
            <li aria-current="page">{thread.title || "Thread"}</li>
          </ol>
        </nav>

        {isAdmin && (
          <div className="tpu-forum__thread-topbar">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => confirmDelete("thread", thread.id)}
            >
              Delete Thread
            </Button>
          </div>
        )}

        <Card role="article" aria-label="Question">
          <CardHeader>
            <h1 className="tpu-forum__thread-title">{thread.title || "Thread"}</h1>
            <CardDescription>
              {answered ? (
                <Badge variant="success">Answered</Badge>
              ) : (
                <Badge variant="outline">Open</Badge>
              )}
              <span className="tpu-forum__tagrow">
                {tags.slice(0, 8).map((t) => (
                  <Badge key={String(t)} variant="secondary">
                    {String(t)}
                  </Badge>
                ))}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="tpu-forum__richtext"
              dangerouslySetInnerHTML={{ __html: threadBody }}
            />
          </CardContent>
          <CardFooter className="tpu-forum__thread-footer">
            <VoteWidget
              score={thread.votes ?? thread.score ?? 0}
              disabled={!canInteract}
              onUpvote={() => voteThread(1)}
              onDownvote={() => voteThread(-1)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                if (!requireAuth()) return;
                setReplyParentId(null);
                setReplyOpen(true);
              }}
            >
              Reply
            </Button>
          </CardFooter>
        </Card>

        {accepted && (
          <Card className="tpu-forum__accepted" role="article" aria-label="Accepted answer">
            <CardHeader>
              <h2 className="tpu-forum__section-heading">
                <Badge variant="success" style={{ marginRight: "0.5rem", verticalAlign: "middle" }}>&#10003; Accepted</Badge>
                Answer
              </h2>
            </CardHeader>
            <CardContent>
              <div
                className="tpu-forum__richtext"
                dangerouslySetInnerHTML={{
                  __html: sanitizeUserHtml(
                    accepted.bodyHtml || accepted.body || "",
                  ),
                }}
              />
            </CardContent>
            <CardFooter className="tpu-forum__comment-footer">
              <VoteWidget
                score={accepted.votes ?? accepted.score ?? 0}
                disabled={!canInteract}
                onUpvote={() => voteComment(accepted.id, 1)}
                onDownvote={() => voteComment(accepted.id, -1)}
              />
            </CardFooter>
          </Card>
        )}

        <Card className="tpu-forum__comments">
          <CardHeader>
            <h2 className="tpu-forum__section-heading">
              {accepted ? "Other Answers" : "Answers"} ({rootComments.length})
            </h2>
            <CardDescription>
              <Tabs value={commentSort} onValueChange={setCommentSort}>
                <TabsList>
                  <TabsTrigger value="best">Best</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardDescription>
          </CardHeader>
          <CardContent className="tpu-forum__comments-list">
            {rootComments.length === 0 ? (
              <EmptyState
                title={accepted ? "No other replies yet" : "No replies yet"}
                message="Be the first to reply."
                actionLabel="Reply"
                onAction={() => {
                  if (!requireAuth()) return;
                  setReplyParentId(null);
                  setReplyOpen(true);
                }}
              />
            ) : (
              rootComments.map((c) => {
                const children = (byParent.get(String(c.id)) || []).slice(
                  0,
                  50,
                );
                // Check if comment author is admin by matching email in adminList
                const cAuthorEmail = c.author_email || c.authorEmail || "";
                const cIsAuthorAdmin =
                  cAuthorEmail && adminList[cAuthorEmail.toLowerCase()];
                return (
                  <div key={String(c.id)} className="tpu-forum__comment-block">
                    <CommentCard
                      comment={c}
                      depth={0}
                      canInteract={canInteract}
                      isAccepted={
                        acceptedId && String(c.id) === String(acceptedId)
                      }
                      isAuthorAdmin={cIsAuthorAdmin}
                      showDelete={isAdmin}
                      onReply={() => {
                        if (!requireAuth()) return;
                        setReplyParentId(c.id);
                        setReplyOpen(true);
                      }}
                      onVote={(delta) => voteComment(c.id, delta)}
                      onDelete={() => confirmDelete("comment", c.id)}
                    />
                    {children.map((child) => {
                      const childAuthorEmail =
                        child.author_email || child.authorEmail || "";
                      const childIsAuthorAdmin =
                        childAuthorEmail &&
                        adminList[childAuthorEmail.toLowerCase()];
                      return (
                        <CommentCard
                          key={String(child.id)}
                          comment={child}
                          depth={1}
                          canInteract={canInteract}
                          isAccepted={
                            acceptedId &&
                            String(child.id) === String(acceptedId)
                          }
                          isAuthorAdmin={childIsAuthorAdmin}
                          showDelete={isAdmin}
                          onReply={() => {
                            if (!requireAuth()) return;
                            setReplyParentId(c.id);
                            setReplyOpen(true);
                          }}
                          onVote={(delta) => voteComment(child.id, delta)}
                          onDelete={() => confirmDelete("comment", child.id)}
                        />
                      );
                    })}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Related Products section */}
        <RelatedProducts thread={thread} />

        <ReplyDrawer
          open={replyOpen}
          onOpenChange={setReplyOpen}
          onSubmit={submitReply}
          submitting={posting}
          title={replyParentId ? "Reply to comment" : "Reply to thread"}
        />
      </div>
    );
  };

  return (
    <div className="tpu-forum">
      {route.name === "thread" ? renderThread() : renderFeed()}

      {bcSyncState === "syncing" && (
        <div className="tpu-forum__sync-overlay" style={{
          position: "fixed", inset: 0, zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}>
          <Card style={{ maxWidth: 360, textAlign: "center", padding: "2rem" }}>
            <CardContent>
              <Progress style={{ marginBottom: "1rem" }} />
              <p style={{ margin: 0 }}>Setting up your store account...</p>
            </CardContent>
          </Card>
        </div>
      )}
      {bcSyncState === "failed" && (
        <div className="tpu-forum__sync-banner" style={{
          padding: "0.75rem 1rem", backgroundColor: "#fef3cd", borderBottom: "1px solid #ffc107",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span>Store account not linked. You can still use the forum.</span>
          <Button type="button" variant="ghost" size="sm" onClick={() => setBcSyncState(null)}>Dismiss</Button>
        </div>
      )}

      <SignInDrawer
        open={signInOpen}
        onOpenChange={setSignInOpen}
        loginUrl={loginUrl}
        googleLoginUrl={googleLoginUrl}
      />
      <DeleteConfirmDrawer
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={executeDelete}
        targetType={deleteTarget?.type || "item"}
        isDeleting={posting}
      />
    </div>
  );
}

export default ForumApp;
