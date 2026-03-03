import { jwtVerify, SignJWT } from "jose";

type SortMode = "new" | "top" | "unanswered" | "hot";

interface Env {
  STOREFRONT_ORIGIN: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;

  // Secrets (set via `wrangler secret put ...`)
  SUPABASE_JWT_SECRET: string;
  BIGCOMMERCE_ACCESS_TOKEN: string;
  BIGCOMMERCE_CLIENT_ID: string;
  BIGCOMMERCE_CLIENT_SECRET: string;

  BIGCOMMERCE_STORE_HASH: string;

  // Address verification (Google Address Validation API)
  GOOGLE_ADDRESS_VALIDATION_KEY?: string;

  // LTL Freight hub lookup (optional)
  XPO_API_KEY?: string;
  ESTES_API_KEY?: string;

  // Email service (Resend) - set via  `wrangler secret put RESEND_API_KEY`
  RESEND_API_KEY?: string;

  RATE_LIMIT_KV: KVNamespace;
}

type Authed = { userId: string; jwt: string; claims: Record<string, unknown> };

type AdminStatus = {
  isAdmin: boolean;
  displayName?: string;
  role: "admin" | "moderator" | "member";
};

function json(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type"))
    headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function isAllowedOrigin(origin: string, env: Env): boolean {
  // Production origin
  if (origin === env.STOREFRONT_ORIGIN) return true;
  // Local development origins
  if (origin.startsWith("http://localhost:")) return true;
  if (origin.startsWith("http://127.0.0.1:")) return true;
  return false;
}

function withCors(req: Request, env: Env, res: Response): Response {
  const origin = req.headers.get("Origin") || "";
  const allowOrigin = isAllowedOrigin(origin, env) ? origin : "";
  const headers = new Headers(res.headers);
  if (allowOrigin) {
    headers.set("Access-Control-Allow-Origin", allowOrigin);
    headers.set("Access-Control-Allow-Credentials", "true");
  }
  headers.set("Vary", appendVary(headers.get("Vary"), "Origin"));
  headers.set("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "Authorization,Content-Type,x-sf-csrf-token,x-xsrf-token,x-csrf-token",
  );
  headers.set("Access-Control-Max-Age", "600");
  // Note: Must explicitly pass status as Response getters don't spreads
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

function appendVary(existing: string | null, value: string): string {
  if (!existing) return value;
  const parts = existing.split(",").map((p) => p.trim().toLowerCase());
  if (parts.includes(value.toLowerCase())) return existing;
  return `${existing}, ${value}`;
}

function getClientIp(req: Request): string {
  // Cloudflare sets CF-Connecting-IP at the edge.
  const cf = req.headers.get("CF-Connecting-IP");
  if (cf) return cf;
  const xff = req.headers.get("X-Forwarded-For");
  if (!xff) return "0.0.0.0";
  return xff.split(",")[0]?.trim() || "0.0.0.0";
}

function getBearer(req: Request): string | null {
  const h = req.headers.get("Authorization") || "";
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m?.[1] ?? null;
}

async function requireSupabaseJwt(req: Request, env: Env): Promise<Authed> {
  const token = getBearer(req);
  if (!token) throw new HttpError(401, "missing_bearer_token");

  // Supabase JWTs are HS256 signed with the project's JWT secret.
  const secret = new TextEncoder().encode(env.SUPABASE_JWT_SECRET);
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });

  const sub = typeof payload.sub === "string" ? payload.sub : "";
  if (!sub) throw new HttpError(401, "invalid_token_sub");

  return {
    userId: sub,
    jwt: token,
    claims: payload as unknown as Record<string, unknown>,
  };
}

class HttpError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, code: string, details?: unknown) {
    super(code);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function rateLimitOrThrow(
  env: Env,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<void> {
  const now = Date.now();
  const bucket = Math.floor(now / (windowSeconds * 1000));
  const kvKey = `rl:${key}:${bucket}`;

  const existing = await env.RATE_LIMIT_KV.get(kvKey);
  const next = (existing ? Number.parseInt(existing, 10) : 0) + 1;
  if (Number.isNaN(next)) {
    await env.RATE_LIMIT_KV.put(kvKey, "1", {
      expirationTtl: windowSeconds + 5,
    });
    return;
  }
  if (next > limit) {
    throw new HttpError(429, "rate_limited", { windowSeconds, limit });
  }
  await env.RATE_LIMIT_KV.put(kvKey, String(next), {
    expirationTtl: windowSeconds + 5,
  });
}

function countLinks(text: string): number {
  const matches = text.match(/https?:\/\/|www\./gi);
  return matches ? matches.length : 0;
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function parseTagsParam(tagsParam: string | null): string[] {
  if (!tagsParam) return [];
  return tagsParam
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10);
}

function parsePageParam(pageParam: string | null): number {
  const n = pageParam ? Number.parseInt(pageParam, 10) : 1;
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, 5000);
}

function parseSortParam(sortParam: string | null): SortMode {
  const s = (sortParam || "new").toLowerCase();
  if (s === "new" || s === "top" || s === "unanswered" || s === "hot") return s;
  return "new";
}

function supabaseRestUrl(env: Env, path: string): string {
  const base = env.SUPABASE_URL.replace(/\/+$/, "");
  const clean = path.replace(/^\/+/, "");
  return `${base}/rest/v1/${clean}`;
}

async function supabaseFetch(
  env: Env,
  path: string,
  init: RequestInit & {
    jwt?: string;
    preferCount?: boolean;
    range?: { from: number; to: number };
  } = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("apikey", env.SUPABASE_ANON_KEY);
  if (init.jwt) headers.set("Authorization", `Bearer ${init.jwt}`);
  if (init.preferCount) headers.set("Prefer", "count=exact");
  if (init.range) headers.set("Range", `${init.range.from}-${init.range.to}`);
  if (init.body && !headers.has("content-type"))
    headers.set("content-type", "application/json; charset=utf-8");
  headers.set("accept", "application/json");

  return fetch(supabaseRestUrl(env, path), { ...init, headers });
}

function getContentRangeCount(contentRange: string | null): number | null {
  // e.g. "0-19/132"
  if (!contentRange) return null;
  const m = /\/(\d+)$/.exec(contentRange);
  if (!m) return null;
  return Number.parseInt(m[1]!, 10);
}

function hotRank(score: number, createdAtIso: string): number {
  const created = Date.parse(createdAtIso);
  if (!Number.isFinite(created)) return -Infinity;
  const s = score || 0;
  const order = Math.log10(Math.max(Math.abs(s), 1));
  const sign = s > 0 ? 1 : s < 0 ? -1 : 0;
  const seconds = (created - 1134028003000) / 1000; // reddit-ish epoch anchor
  return order + (sign * seconds) / 45000;
}

async function maybeCached(
  req: Request,
  ctx: ExecutionContext,
  ttlSeconds: number,
  handler: () => Promise<Response>,
): Promise<Response> {
  // In local development, skip caching to avoid wrangler cache API issues
  try {
    // Cloudflare provides `caches.default`, but TS lib types don't always include it.
    const cache: Cache | undefined =
      "default" in (caches as unknown as Record<string, unknown>)
        ? (caches as any).default
        : undefined;

    if (cache) {
      const cacheKey = new Request(req.url, req);
      const hit = await cache.match(cacheKey);
      if (hit) return hit;

      const res = await handler();
      const headers = new Headers(res.headers);
      headers.set("Cache-Control", `public, max-age=${ttlSeconds}`);
      const cached = new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers,
      });
      ctx.waitUntil(cache.put(cacheKey, cached.clone()));
      return cached;
    }
  } catch (e) {
    // Cache API not available (e.g., local dev) - fall through to handler
    console.warn(
      "Cache API unavailable, skipping cache:",
      e instanceof Error ? e.message : e,
    );
  }

  // No caching - just run the handler
  const res = await handler();
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", `public, max-age=${ttlSeconds}`);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

async function handleThreadsFeed(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(req.url);
  const sort = parseSortParam(url.searchParams.get("sort"));
  const q = url.searchParams.get("q") || "";
  const tags = parseTagsParam(url.searchParams.get("tags"));
  const page = parsePageParam(url.searchParams.get("page"));
  const pageSize = 20;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const baseSelect =
    "id,title,body,created_at,updated_at,score,comment_count,accepted_comment_id,tags,user_id";

  // Cached because this is a hot path; short TTL.
  return maybeCached(req, ctx, 30, async () => {
    try {
      if (sort === "hot") {
        // Fetch a window of recent threads and compute rank in the worker.
        // This avoids requiring a DB view, while keeping response times OK.
        const recentDays = 30;
        const gte = new Date(
          Date.now() - recentDays * 86400 * 1000,
        ).toISOString();

        const params = new URLSearchParams();
        params.set("select", baseSelect);
        params.set("created_at", `gte.${gte}`);
        params.set("order", "created_at.desc");
        // Pull more than a single page so we can sort by computed hot rank.
        const hotFetchLimit = Math.max(200, (page + 2) * pageSize);

        if (q.trim()) {
          const qq = q.trim().replace(/%/g, "\\%").replace(/_/g, "\\_");
          params.set("or", `(title.ilike.*${qq}*,body.ilike.*${qq}*)`);
        }
        if (tags.length) {
          params.set("tags", `cs.{${tags.join(",")}}`);
        }

        const r = await supabaseFetch(env, `threads?${params.toString()}`, {
          method: "GET",
          preferCount: false,
          range: { from: 0, to: hotFetchLimit - 1 },
        });
        if (!r.ok) {
          return json(
            { error: "supabase_error", details: await safeJson(r) },
            { status: 502 },
          );
        }
        const rows = (await r.json()) as Array<Record<string, unknown>>;
        const ranked = rows
          .map((t) => ({
            ...t,
            _hot: hotRank(Number(t.score ?? 0), String(t.created_at ?? "")),
          }))
          .sort((a, b) => (b._hot as number) - (a._hot as number));

        const slice = ranked
          .slice(from, from + pageSize)
          .map(({ _hot, ...t }) => t);
        return json(
          { data: slice, meta: { sort, page, pageSize, total: ranked.length } },
          { status: 200 },
        );
      }

      const params = new URLSearchParams();
      params.set("select", baseSelect);

      if (q.trim()) {
        const qq = q.trim().replace(/%/g, "\\%").replace(/_/g, "\\_");
        params.set("or", `(title.ilike.*${qq}*,body.ilike.*${qq}*)`);
      }
      if (tags.length) {
        params.set("tags", `cs.{${tags.join(",")}}`);
      }

      if (sort === "new") params.set("order", "created_at.desc");
      if (sort === "top") params.set("order", "score.desc");
      if (sort === "unanswered") {
        params.set("accepted_comment_id", "is.null");
        params.set("order", "created_at.desc");
      }

      const r = await supabaseFetch(env, `threads?${params.toString()}`, {
        method: "GET",
        preferCount: true,
        range: { from, to },
      });
      if (!r.ok) {
        return json(
          { error: "supabase_error", details: await safeJson(r) },
          { status: 502 },
        );
      }
      const total = getContentRangeCount(r.headers.get("content-range"));
      const data = await r.json();
      return json(
        { data, meta: { sort, page, pageSize, total } },
        { status: 200 },
      );
    } catch (handlerErr) {
      console.error(
        "handleThreadsFeed handler error:",
        handlerErr instanceof Error ? handlerErr.message : handlerErr,
        handlerErr instanceof Error ? handlerErr.stack : "",
      );
      return json(
        {
          error: "handler_error",
          details:
            handlerErr instanceof Error
              ? handlerErr.message
              : String(handlerErr),
        },
        { status: 500 },
      );
    }
  });
}

async function handleGetThread(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  threadId: string,
): Promise<Response> {
  return maybeCached(req, ctx, 30, async () => {
    const params = new URLSearchParams();
    params.set(
      "select",
      "id,title,body,created_at,updated_at,score,comment_count,accepted_comment_id,tags,user_id",
    );
    params.set("id", `eq.${threadId}`);
    const r = await supabaseFetch(env, `threads?${params.toString()}`, {
      method: "GET",
    });
    if (!r.ok)
      return json(
        { error: "supabase_error", details: await safeJson(r) },
        { status: 502 },
      );
    const rows = (await r.json()) as unknown[];
    const thread = rows[0] ?? null;
    if (!thread) return json({ error: "not_found" }, { status: 404 });
    return json({ data: thread }, { status: 200 });
  });
}

async function handleCreateThread(
  req: Request,
  env: Env,
  authed: Authed,
): Promise<Response> {
  const body = (await req.json().catch(() => null)) as null | Record<
    string,
    unknown
  >;
  if (!body) throw new HttpError(400, "invalid_json");

  const title = asString(body.title).trim();
  const content = asString(body.body).trim();
  const tags = Array.isArray(body.tags)
    ? body.tags
        .map(String)
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 10)
    : [];

  if (title.length < 8) throw new HttpError(400, "title_too_short");
  if (content.length < 20) throw new HttpError(400, "body_too_short");
  if (countLinks(`${title}\n${content}`) > 2)
    throw new HttpError(400, "too_many_links");

  const insert = { title, body: content, tags, user_id: authed.userId };

  const r = await supabaseFetch(env, "threads", {
    method: "POST",
    jwt: authed.jwt,
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(insert),
  });
  if (!r.ok)
    return json(
      { error: "supabase_error", details: await safeJson(r) },
      { status: 502 },
    );
  const created = (await r.json()) as unknown[];
  return json({ data: created[0] ?? null }, { status: 201 });
}

async function handleVoteThread(
  req: Request,
  env: Env,
  authed: Authed,
  threadId: string,
): Promise<Response> {
  const body = (await req.json().catch(() => null)) as null | Record<
    string,
    unknown
  >;
  if (!body) throw new HttpError(400, "invalid_json");
  const value = Number(body.value);
  if (![1, -1].includes(value)) throw new HttpError(400, "invalid_vote_value");

  // Assumes a `thread_votes` table with unique(thread_id, user_id) and a DB trigger/view
  // maintains thread score/comment_count. If your schema uses RPC instead, swap here.
  const upsert = { thread_id: threadId, user_id: authed.userId, value };

  const r = await supabaseFetch(env, "thread_votes", {
    method: "POST",
    jwt: authed.jwt,
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(upsert),
  });
  if (!r.ok)
    return json(
      { error: "supabase_error", details: await safeJson(r) },
      { status: 502 },
    );
  const row = (await r.json()) as unknown[];
  return json({ data: row[0] ?? null }, { status: 200 });
}

async function handleGetThreadComments(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  threadId: string,
): Promise<Response> {
  return maybeCached(req, ctx, 20, async () => {
    const params = new URLSearchParams();
    params.set(
      "select",
      "id,thread_id,body,created_at,updated_at,score,user_id",
    );
    params.set("thread_id", `eq.${threadId}`);
    params.set("order", "created_at.asc");
    const r = await supabaseFetch(env, `comments?${params.toString()}`, {
      method: "GET",
    });
    if (!r.ok)
      return json(
        { error: "supabase_error", details: await safeJson(r) },
        { status: 502 },
      );
    return json({ data: await r.json() }, { status: 200 });
  });
}

async function handleCreateComment(
  req: Request,
  env: Env,
  authed: Authed,
  threadId: string,
): Promise<Response> {
  const body = (await req.json().catch(() => null)) as null | Record<
    string,
    unknown
  >;
  if (!body) throw new HttpError(400, "invalid_json");
  const content = asString(body.body).trim();
  if (content.length < 5) throw new HttpError(400, "comment_too_short");
  if (countLinks(content) > 2) throw new HttpError(400, "too_many_links");

  const insert = { thread_id: threadId, body: content, user_id: authed.userId };
  const r = await supabaseFetch(env, "comments", {
    method: "POST",
    jwt: authed.jwt,
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(insert),
  });
  if (!r.ok)
    return json(
      { error: "supabase_error", details: await safeJson(r) },
      { status: 502 },
    );
  const created = (await r.json()) as unknown[];
  return json({ data: created[0] ?? null }, { status: 201 });
}

async function handleVoteComment(
  req: Request,
  env: Env,
  authed: Authed,
  commentId: string,
): Promise<Response> {
  const body = (await req.json().catch(() => null)) as null | Record<
    string,
    unknown
  >;
  if (!body) throw new HttpError(400, "invalid_json");
  const value = Number(body.value);
  if (![1, -1].includes(value)) throw new HttpError(400, "invalid_vote_value");

  const upsert = { comment_id: commentId, user_id: authed.userId, value };
  const r = await supabaseFetch(env, "comment_votes", {
    method: "POST",
    jwt: authed.jwt,
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(upsert),
  });
  if (!r.ok)
    return json(
      { error: "supabase_error", details: await safeJson(r) },
      { status: 502 },
    );
  const row = (await r.json()) as unknown[];
  return json({ data: row[0] ?? null }, { status: 200 });
}

async function handleAcceptComment(
  req: Request,
  env: Env,
  authed: Authed,
  commentId: string,
): Promise<Response> {
  // Fetch comment to find thread_id, then update thread's accepted_comment_id.
  const cParams = new URLSearchParams();
  cParams.set("select", "id,thread_id");
  cParams.set("id", `eq.${commentId}`);
  const c = await supabaseFetch(env, `comments?${cParams.toString()}`, {
    method: "GET",
    jwt: authed.jwt,
  });
  if (!c.ok)
    return json(
      { error: "supabase_error", details: await safeJson(c) },
      { status: 502 },
    );
  const comments = (await c.json()) as Array<Record<string, unknown>>;
  const threadId = String(comments[0]?.thread_id ?? "");
  if (!threadId) return json({ error: "not_found" }, { status: 404 });

  const tParams = new URLSearchParams();
  tParams.set("id", `eq.${threadId}`);
  const r = await supabaseFetch(env, `threads?${tParams.toString()}`, {
    method: "PATCH",
    jwt: authed.jwt,
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ accepted_comment_id: commentId }),
  });
  if (!r.ok)
    return json(
      { error: "supabase_error", details: await safeJson(r) },
      { status: 502 },
    );
  const updated = (await r.json()) as unknown[];
  return json({ data: updated[0] ?? null }, { status: 200 });
}

async function handleRelatedKits(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
  threadId: string,
): Promise<Response> {
  return maybeCached(req, ctx, 60, async () => {
    // Try multiple possible schema fields to find SKUs.
    const params = new URLSearchParams();
    params.set(
      "select",
      "id,kit_skus,related_kit_skus,related_kits,product_skus",
    );
    params.set("id", `eq.${threadId}`);
    const r = await supabaseFetch(env, `threads?${params.toString()}`, {
      method: "GET",
    });
    if (!r.ok)
      return json(
        { error: "supabase_error", details: await safeJson(r) },
        { status: 502 },
      );
    const rows = (await r.json()) as Array<Record<string, unknown>>;
    const t = rows[0] ?? {};

    const skus: string[] = [];
    const pushSkus = (v: unknown) => {
      if (Array.isArray(v)) {
        for (const s of v) {
          const ss = String(s).trim();
          if (ss) skus.push(ss);
        }
      } else if (typeof v === "string") {
        for (const part of v.split(",")) {
          const ss = part.trim();
          if (ss) skus.push(ss);
        }
      }
    };
    pushSkus(t.related_kit_skus);
    pushSkus(t.kit_skus);
    pushSkus(t.related_kits);
    pushSkus(t.product_skus);

    const unique = Array.from(new Set(skus)).slice(0, 25);
    if (!unique.length) return json({ data: [] }, { status: 200 });

    if (!env.BIGCOMMERCE_STORE_HASH || !env.BIGCOMMERCE_ACCESS_TOKEN) {
      return json({ error: "bigcommerce_not_configured" }, { status: 501 });
    }

    const storeHash = env.BIGCOMMERCE_STORE_HASH;
    const bcUrl = new URL(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/catalog/products`,
    );
    bcUrl.searchParams.set("include", "images");
    bcUrl.searchParams.set("limit", String(unique.length));
    bcUrl.searchParams.set("sku:in", unique.join(","));

    const bc = await fetch(bcUrl.toString(), {
      headers: {
        "X-Auth-Token": env.BIGCOMMERCE_ACCESS_TOKEN,
        Accept: "application/json",
      },
    });
    if (!bc.ok)
      return json(
        { error: "bigcommerce_error", details: await safeJson(bc) },
        { status: 502 },
      );
    const data = await bc.json();
    return json({ data }, { status: 200 });
  });
}

async function safeJson(r: Response): Promise<unknown> {
  const text = await r.text().catch(() => "");
  if (!text) return { status: r.status };
  try {
    return JSON.parse(text);
  } catch {
    return { status: r.status, text: text.slice(0, 2000) };
  }
}

// =============================================================================
// Admin System
// =============================================================================

/**
 * Check if the authenticated user is a forum admin
 * Queries the forum_admins table by email
 */
async function checkAdminStatus(env: Env, email: string): Promise<AdminStatus> {
  if (!email) {
    return { isAdmin: false, role: "member" };
  }

  const params = new URLSearchParams();
  params.set("select", "email,display_name");
  params.set("email", `ilike.${email}`);

  const r = await supabaseFetch(env, `forum_admins?${params.toString()}`, {
    method: "GET",
  });
  if (!r.ok) {
    console.error("Admin check failed:", await safeJson(r));
    return { isAdmin: false, role: "member" };
  }

  const rows = (await r.json()) as Array<{
    email: string;
    display_name: string;
  }>;
  if (rows.length > 0) {
    return {
      isAdmin: true,
      displayName: rows[0]?.display_name || "Admin",
      role: "admin",
    };
  }

  return { isAdmin: false, role: "member" };
}

/**
 * Get the role of a user by their user_id
 * Looks up the user's email from auth.users and checks admin status
 */
async function getUserRole(
  env: Env,
  userId: string,
  jwt: string,
): Promise<"admin" | "moderator" | "member"> {
  // For now, we'll need to query the forum_admins table with service role
  // Since we can't easily get email from user_id without service role access,
  // we'll check if the user's posts are from an admin email in the API response enrichment
  return "member";
}

/**
 * Require admin privileges - throws HttpError if not admin
 */
async function requireAdmin(env: Env, authed: Authed): Promise<AdminStatus> {
  const email = asString(authed.claims.email);
  const status = await checkAdminStatus(env, email);
  if (!status.isAdmin) {
    throw new HttpError(
      403,
      "admin_required",
      "This action requires admin privileges",
    );
  }
  return status;
}

/**
 * Handle GET /admin/me
 * Returns admin status for the authenticated user
 */
async function handleAdminMe(
  req: Request,
  env: Env,
  authed: Authed,
): Promise<Response> {
  const email = asString(authed.claims.email);
  const status = await checkAdminStatus(env, email);

  return json(
    {
      isAdmin: status.isAdmin,
      role: status.role,
      displayName: status.displayName || null,
      email: email || null,
    },
    { status: 200 },
  );
}

/**
 * Handle DELETE /threads/:id
 * Deletes a thread (admin only)
 */
async function handleDeleteThread(
  req: Request,
  env: Env,
  authed: Authed,
  threadId: string,
): Promise<Response> {
  // Verify admin status
  await requireAdmin(env, authed);

  // Delete the thread via Supabase
  const params = new URLSearchParams();
  params.set("id", `eq.${threadId}`);

  const r = await supabaseFetch(env, `threads?${params.toString()}`, {
    method: "DELETE",
    jwt: authed.jwt,
    headers: { Prefer: "return=representation" },
  });

  if (!r.ok) {
    const errorData = await safeJson(r);
    console.error("Delete thread failed:", errorData);
    return json(
      { error: "delete_failed", details: errorData },
      { status: 502 },
    );
  }

  const deleted = (await r.json()) as unknown[];
  if (!deleted.length) {
    return json(
      { error: "not_found", message: "Thread not found or already deleted" },
      { status: 404 },
    );
  }

  return json({ success: true, deleted: deleted[0] }, { status: 200 });
}

/**
 * Handle DELETE /comments/:id
 * Deletes a comment (admin only)
 */
async function handleDeleteComment(
  req: Request,
  env: Env,
  authed: Authed,
  commentId: string,
): Promise<Response> {
  // Verify admin status
  await requireAdmin(env, authed);

  // Delete the comment via Supabase
  const params = new URLSearchParams();
  params.set("id", `eq.${commentId}`);

  const r = await supabaseFetch(env, `comments?${params.toString()}`, {
    method: "DELETE",
    jwt: authed.jwt,
    headers: { Prefer: "return=representation" },
  });

  if (!r.ok) {
    const errorData = await safeJson(r);
    console.error("Delete comment failed:", errorData);
    return json(
      { error: "delete_failed", details: errorData },
      { status: 502 },
    );
  }

  const deleted = (await r.json()) as unknown[];
  if (!deleted.length) {
    return json(
      { error: "not_found", message: "Comment not found or already deleted" },
      { status: 404 },
    );
  }

  return json({ success: true, deleted: deleted[0] }, { status: 200 });
}

/**
 * Handle GET /admin/list
 * Returns list of all admin emails and display names for author role display
 * This is a public endpoint (read-only) so the frontend can show admin badges
 */
async function handleAdminList(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  return maybeCached(req, ctx, 300, async () => {
    const params = new URLSearchParams();
    params.set("select", "email,display_name");

    const r = await supabaseFetch(env, `forum_admins?${params.toString()}`, {
      method: "GET",
    });
    if (!r.ok) {
      console.error("Admin list fetch failed:", await safeJson(r));
      return json({ admins: [] }, { status: 200 });
    }

    const rows = (await r.json()) as Array<{
      email: string;
      display_name: string;
    }>;

    // Return a map of email -> display_name for easy lookup
    const admins = rows.reduce(
      (acc, row) => {
        acc[row.email.toLowerCase()] = row.display_name;
        return acc;
      },
      {} as Record<string, string>,
    );

    return json({ admins }, { status: 200 });
  });
}

// =============================================================================
// BigCommerce Customer Login (OAuth Integration)
// =============================================================================

interface BCCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

/**
 * Find a BigCommerce customer by email address
 */
async function findBCCustomerByEmail(
  env: Env,
  email: string,
): Promise<BCCustomer | null> {
  const storeHash = env.BIGCOMMERCE_STORE_HASH;
  const url = new URL(
    `https://api.bigcommerce.com/stores/${storeHash}/v3/customers`,
  );
  url.searchParams.set("email:in", email);

  const res = await fetch(url.toString(), {
    headers: {
      "X-Auth-Token": env.BIGCOMMERCE_ACCESS_TOKEN,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error("BigCommerce find customer error:", await res.text());
    return null;
  }

  const data = (await res.json()) as { data: BCCustomer[] };
  return data.data?.[0] ?? null;
}

/**
 * Get a BigCommerce customer by ID
 */
async function getBCCustomerById(
  env: Env,
  customerId: number,
): Promise<BCCustomer | null> {
  const storeHash = env.BIGCOMMERCE_STORE_HASH;
  const url = new URL(
    `https://api.bigcommerce.com/stores/${storeHash}/v3/customers`,
  );
  url.searchParams.set("id:in", String(customerId));

  const res = await fetch(url.toString(), {
    headers: {
      "X-Auth-Token": env.BIGCOMMERCE_ACCESS_TOKEN,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    console.error("BigCommerce get customer by ID error:", await res.text());
    return null;
  }

  const data = (await res.json()) as { data: BCCustomer[] };
  return data.data?.[0] ?? null;
}

/**
 * Create a new BigCommerce customer (for OAuth users, no password needed)
 */
async function createBCCustomer(
  env: Env,
  email: string,
  firstName: string,
  lastName: string,
): Promise<BCCustomer | null> {
  const storeHash = env.BIGCOMMERCE_STORE_HASH;
  const url = `https://api.bigcommerce.com/stores/${storeHash}/v3/customers`;

  // Generate a random password for OAuth users (they won't use it, they'll always use OAuth)
  const randomPassword = crypto.randomUUID() + crypto.randomUUID();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "X-Auth-Token": env.BIGCOMMERCE_ACCESS_TOKEN,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify([
      {
        email,
        first_name: firstName || "Customer",
        last_name: lastName || "",
        authentication: {
          new_password: randomPassword,
        },
      },
    ]),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("BigCommerce create customer error:", errorText);
    return null;
  }

  const data = (await res.json()) as { data: BCCustomer[] };
  return data.data?.[0] ?? null;
}

/**
 * Generate a BigCommerce Customer Login JWT
 * This JWT allows direct login without password
 * See: https://developer.bigcommerce.com/docs/start/authentication/customer-login
 */
async function generateBCLoginJWT(
  env: Env,
  customerId: number,
  redirectTo: string = "/",
): Promise<string> {
  const secret = new TextEncoder().encode(env.BIGCOMMERCE_CLIENT_SECRET);
  const now = Math.floor(Date.now() / 1000);
  const jti = crypto.randomUUID();

  const jwt = await new SignJWT({
    iss: env.BIGCOMMERCE_CLIENT_ID,
    iat: now,
    jti,
    operation: "customer_login",
    store_hash: env.BIGCOMMERCE_STORE_HASH,
    customer_id: customerId,
    redirect_to: redirectTo,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(now + 30) // JWT valid for 30 seconds
    .sign(secret);

  return jwt;
}

/**
 * Build the BigCommerce login URL with JWT
 */
function buildBCLoginUrl(env: Env, jwt: string): string {
  return `${env.STOREFRONT_ORIGIN}/login/token/${jwt}`;
}

/**
 * Handle POST /auth/bc-login
 * Finds or creates a BigCommerce customer for the authenticated Supabase user,
 * then returns a login URL that will log them into BigCommerce.
 */
async function handleBCLogin(
  req: Request,
  env: Env,
  authed: Authed,
): Promise<Response> {
  // Extract email from Supabase JWT claims
  const email = asString(authed.claims.email);
  if (!email) {
    throw new HttpError(
      400,
      "missing_email",
      "Supabase token missing email claim",
    );
  }

  // Extract name from user metadata if available
  const userMetadata = (authed.claims.user_metadata || {}) as Record<
    string,
    unknown
  >;
  const fullName = asString(userMetadata.full_name || userMetadata.name || "");
  const nameParts = fullName.split(" ");
  const firstName =
    nameParts[0] || asString(userMetadata.first_name) || "Customer";
  const lastName =
    nameParts.slice(1).join(" ") || asString(userMetadata.last_name) || "";

  // Parse request body for redirect URL
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const redirectTo = asString(body.redirect_to) || "/account.php";

  // Check if BigCommerce is configured
  if (!env.BIGCOMMERCE_STORE_HASH || !env.BIGCOMMERCE_ACCESS_TOKEN) {
    throw new HttpError(501, "bigcommerce_not_configured");
  }
  if (!env.BIGCOMMERCE_CLIENT_ID || !env.BIGCOMMERCE_CLIENT_SECRET) {
    throw new HttpError(
      501,
      "bigcommerce_login_not_configured",
      "BIGCOMMERCE_CLIENT_ID and BIGCOMMERCE_CLIENT_SECRET are required for customer login",
    );
  }

  // Find existing customer
  let customer = await findBCCustomerByEmail(env, email);

  // Create customer if not found
  if (!customer) {
    customer = await createBCCustomer(env, email, firstName, lastName);
    if (!customer) {
      throw new HttpError(
        500,
        "customer_creation_failed",
        "Could not create BigCommerce customer",
      );
    }
  }

  // Generate login JWT
  const loginJwt = await generateBCLoginJWT(env, customer.id, redirectTo);
  const loginUrl = buildBCLoginUrl(env, loginJwt);

  return json(
    {
      success: true,
      customer_id: customer.id,
      login_url: loginUrl,
    },
    { status: 200 },
  );
}

/**
 * Handle POST /auth/bc-exchange
 * Exchanges BigCommerce customer identity for a forum JWT token.
 * This allows BigCommerce-logged-in users to authenticate with the forum
 * without requiring a separate Supabase login.
 *
 * Body: { customer_id: number, email: string }
 * Returns: { token: string, expires_at: number }
 */
async function handleBCExchange(req: Request, env: Env): Promise<Response> {
  // Parse request body
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const customerId =
    typeof body.customer_id === "number" ? body.customer_id : null;
  const email =
    typeof body.email === "string" ? body.email.toLowerCase().trim() : "";

  if (!customerId || !email) {
    throw new HttpError(
      400,
      "missing_params",
      "customer_id and email are required",
    );
  }

  // Verify BigCommerce is configured
  if (!env.BIGCOMMERCE_STORE_HASH || !env.BIGCOMMERCE_ACCESS_TOKEN) {
    throw new HttpError(501, "bigcommerce_not_configured");
  }

  // Verify the customer exists in BigCommerce and email matches
  const customer = await getBCCustomerById(env, customerId);
  if (!customer) {
    throw new HttpError(
      401,
      "customer_not_found",
      "BigCommerce customer not found",
    );
  }

  // Verify email matches (case-insensitive)
  if (customer.email.toLowerCase() !== email) {
    throw new HttpError(
      401,
      "email_mismatch",
      "Email does not match customer record",
    );
  }

  // Issue a forum JWT token signed with SUPABASE_JWT_SECRET
  // This allows the forum API to verify the token using the same secret
  const secret = new TextEncoder().encode(env.SUPABASE_JWT_SECRET);
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + 7 * 24 * 60 * 60; // 7 days

  const token = await new SignJWT({
    sub: `bc_${customerId}`,
    email: customer.email,
    name: `${customer.first_name} ${customer.last_name}`.trim(),
    source: "bigcommerce",
    bc_customer_id: customerId,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .sign(secret);

  return json(
    {
      success: true,
      token,
      expires_at: expiresAt,
      customer: {
        id: customer.id,
        email: customer.email,
        name: `${customer.first_name} ${customer.last_name}`.trim(),
      },
    },
    { status: 200 },
  );
}

// =============================================================================
// Address Verification (Residential/Commercial Detection)
// =============================================================================

interface AddressVerifyRequest {
  street: string;
  city: string;
  state: string;
  zip: string;
  street2?: string;
}

interface AddressVerifyResponse {
  verified: boolean;
  isResidential: boolean | null; // null means unknown
  correctedAddress?: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zip: string;
  };
  deliveryPoint?: "residential" | "commercial" | "pobox" | "unknown";
  provider: "google" | "none";
  nearestHub?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    distance?: number;
  } | null;
}

/**
 * Verify address using Google Address Validation API
 * Returns residential/commercial indicator from metadata
 */
async function verifyAddressGoogle(
  env: Env,
  address: AddressVerifyRequest,
): Promise<AddressVerifyResponse> {
  const apiKey = env.GOOGLE_ADDRESS_VALIDATION_KEY;
  if (!apiKey) {
    throw new HttpError(501, "google_address_validation_not_configured");
  }

  const url = `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: {
        regionCode: "US",
        addressLines: address.street2
          ? [address.street, address.street2]
          : [address.street],
        locality: address.city,
        administrativeArea: address.state,
        postalCode: address.zip,
      },
    }),
  });

  if (!res.ok) {
    const errorData = await safeJson(res);
    console.error("Google Address Validation error:", errorData);
    // Return unverified response instead of throwing
    return {
      verified: false,
      isResidential: null,
      provider: "google",
      deliveryPoint: "unknown",
      nearestHub: null,
    };
  }

  const data = (await res.json()) as {
    result?: {
      verdict?: {
        addressComplete?: boolean;
        hasUnconfirmedComponents?: boolean;
        hasInferredComponents?: boolean;
        validationGranularity?: string;
      };
      address?: {
        formattedAddress?: string;
        postalAddress?: {
          regionCode?: string;
          postalCode?: string;
          administrativeArea?: string;
          locality?: string;
          addressLines?: string[];
        };
        missingComponentTypes?: string[];
        missingComponentTypes?: string[];
      };
      metadata?: {
        residential?: boolean;
        business?: boolean;
        poBox?: boolean;
      };
    };
  };

  const metadata = data.result?.metadata;
  const verdict = data.result?.verdict;
  const postalAddress = data.result?.address?.postalAddress;

  // Determine address type from metadata
  let isResidential: boolean | null = null;
  let deliveryPoint: "residential" | "commercial" | "pobox" | "unknown" =
    "unknown";

  if (metadata) {
    if (metadata.residential === true) {
      isResidential = true;
      deliveryPoint = "residential";
    } else if (metadata.business === true) {
      isResidential = false;
      deliveryPoint = "commercial";
    } else if (metadata.poBox === true) {
      isResidential = false;
      deliveryPoint = "pobox";
    }
  }

  // Build corrected address if available
  const correctedAddress = postalAddress
    ? {
        street: postalAddress.addressLines?.[0] || address.street,
        street2: postalAddress.addressLines?.[1],
        city: postalAddress.locality || address.city,
        state: postalAddress.administrativeArea || address.state,
        zip: postalAddress.postalCode || address.zip,
      }
    : undefined;

  return {
    verified:
      verdict?.addressComplete === true && !verdict?.hasUnconfirmedComponents,
    isResidential,
    correctedAddress,
    deliveryPoint,
    provider: "google",
    nearestHub: null,
  };
}

// =============================================================================
// LTL Freight Hub Lookup
// =============================================================================

interface FreightHub {
  name: string;
  address: string;
  street?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  distance?: number;
  carrier: string;
}

/**
 * Static list of major freight terminals
 * This can be replaced with carrier API calls when API keys are available
 */
const FREIGHT_TERMINALS: FreightHub[] = [
  // XPO Logistics major terminals
  {
    name: "XPO Logistics - Dallas",
    address: "4901 Singleton Blvd, Dallas, TX 75212",
    street: "4901 Singleton Blvd",
    city: "Dallas",
    state: "TX",
    zip: "75212",
    carrier: "XPO",
  },
  {
    name: "XPO Logistics - Houston",
    address: "12500 Cutten Rd, Houston, TX 77066",
    street: "12500 Cutten Rd",
    city: "Houston",
    state: "TX",
    zip: "77066",
    carrier: "XPO",
  },
  {
    name: "XPO Logistics - Phoenix",
    address: "4020 E Broadway Rd, Phoenix, AZ 85040",
    street: "4020 E Broadway Rd",
    city: "Phoenix",
    state: "AZ",
    zip: "85040",
    carrier: "XPO",
  },
  {
    name: "XPO Logistics - Atlanta",
    address: "4200 Shirley Dr SW, Atlanta, GA 30336",
    street: "4200 Shirley Dr SW",
    city: "Atlanta",
    state: "GA",
    zip: "30336",
    carrier: "XPO",
  },
  {
    name: "XPO Logistics - Chicago",
    address: "2500 S Western Ave, Chicago, IL 60608",
    street: "2500 S Western Ave",
    city: "Chicago",
    state: "IL",
    zip: "60608",
    carrier: "XPO",
  },
  {
    name: "XPO Logistics - Los Angeles",
    address: "14800 S Main St, Gardena, CA 90248",
    street: "14800 S Main St",
    city: "Gardena",
    state: "CA",
    zip: "90248",
    carrier: "XPO",
  },
  {
    name: "XPO Logistics - Denver",
    address: "4901 Ivy St, Commerce City, CO 80022",
    street: "4901 Ivy St",
    city: "Commerce City",
    state: "CO",
    zip: "80022",
    carrier: "XPO",
  },

  // Estes Express major terminals
  {
    name: "Estes Express - Richmond",
    address: "3901 W Broad St, Richmond, VA 23230",
    street: "3901 W Broad St",
    city: "Richmond",
    state: "VA",
    zip: "23230",
    carrier: "Estes",
  },
  {
    name: "Estes Express - Charlotte",
    address: "8601 Statesville Rd, Charlotte, NC 28269",
    street: "8601 Statesville Rd",
    city: "Charlotte",
    state: "NC",
    zip: "28269",
    carrier: "Estes",
  },
  {
    name: "Estes Express - Nashville",
    address: "1300 Antioch Pike, Nashville, TN 37211",
    street: "1300 Antioch Pike",
    city: "Nashville",
    state: "TN",
    zip: "37211",
    carrier: "Estes",
  },
  {
    name: "Estes Express - Indianapolis",
    address: "5151 W 96th St, Indianapolis, IN 46268",
    street: "5151 W 96th St",
    city: "Indianapolis",
    state: "IN",
    zip: "46268",
    carrier: "Estes",
  },

  // Old Dominion terminals
  {
    name: "Old Dominion - Thomasville",
    address: "1101 National Hwy, Thomasville, NC 27360",
    street: "1101 National Hwy",
    city: "Thomasville",
    state: "NC",
    zip: "27360",
    carrier: "ODFL",
  },
  {
    name: "Old Dominion - Memphis",
    address: "3505 Lamar Ave, Memphis, TN 38118",
    street: "3505 Lamar Ave",
    city: "Memphis",
    state: "TN",
    zip: "38118",
    carrier: "ODFL",
  },
  {
    name: "Old Dominion - Fort Worth",
    address: "4400 Mercantile Plaza, Fort Worth, TX 76137",
    street: "4400 Mercantile Plaza",
    city: "Fort Worth",
    state: "TX",
    zip: "76137",
    carrier: "ODFL",
  },

  // SAIA terminals
  {
    name: "SAIA - Johns Creek",
    address: "11465 Johns Creek Pkwy, Johns Creek, GA 30097",
    street: "11465 Johns Creek Pkwy",
    city: "Johns Creek",
    state: "GA",
    zip: "30097",
    carrier: "SAIA",
  },
  {
    name: "SAIA - Houma",
    address: "1200 Grand Caillou Rd, Houma, LA 70363",
    street: "1200 Grand Caillou Rd",
    city: "Houma",
    state: "LA",
    zip: "70363",
    carrier: "SAIA",
  },
];

/**
 * Calculate approximate distance between two ZIP codes
 * Uses a simple lookup table for US ZIP code centroids
 * For production, use Google Distance Matrix API or similar
 */
function estimateDistanceByZip(zip1: string, zip2: string): number | null {
  // Simple ZIP code prefix-based distance estimation
  // First 3 digits of ZIP give rough geographic area
  const prefix1 = zip1.slice(0, 3);
  const prefix2 = zip2.slice(0, 3);

  if (prefix1 === prefix2) return 15; // Same area

  // Very rough estimation based on ZIP prefix differences
  const diff = Math.abs(parseInt(prefix1, 10) - parseInt(prefix2, 10));

  if (diff < 5) return 50;
  if (diff < 10) return 100;
  if (diff < 20) return 200;
  if (diff < 50) return 400;
  return 600;
}

/**
 * Find nearest freight terminals to a ZIP code
 */
function findNearestFreightHubs(
  zip: string,
  state: string,
  limit: number = 3,
): FreightHub[] {
  // First, filter by state if possible
  const sameState = FREIGHT_TERMINALS.filter((t) => t.state === state);

  // Calculate distances and sort
  const withDistances = FREIGHT_TERMINALS.map((terminal) => ({
    ...terminal,
    distance: estimateDistanceByZip(zip, terminal.zip) || 999,
  }));

  // Sort by distance
  withDistances.sort((a, b) => a.distance - b.distance);

  // Return top N
  return withDistances.slice(0, limit);
}

/**
 * Handle POST /freight/hubs
 * Find nearest freight terminals for LTL shipments
 */
async function handleFreightHubs(req: Request, env: Env): Promise<Response> {
  const body = (await req.json().catch(() => null)) as null | Record<
    string,
    unknown
  >;
  if (!body) throw new HttpError(400, "invalid_json");

  const zip = asString(body.zip).trim();
  const state = asString(body.state).trim();
  const limit = Math.min(Number(body.limit) || 3, 10);

  if (!zip) throw new HttpError(400, "missing_zip");

  const hubs = findNearestFreightHubs(zip, state, limit);

  return json(
    {
      hubs,
      count: hubs.length,
      note: "Distances are approximate. Contact carrier for exact terminal locations.",
    },
    { status: 200 },
  );
}

/**
 * Handle POST /address/verify
 * Verifies an address and returns residential/commercial indicator
 */
async function handleAddressVerify(req: Request, env: Env): Promise<Response> {
  const body = (await req.json().catch(() => null)) as null | Record<
    string,
    unknown
  >;
  if (!body) throw new HttpError(400, "invalid_json");

  const street = asString(body.street).trim();
  const city = asString(body.city).trim();
  const state = asString(body.state).trim();
  const zip = asString(body.zip).trim();
  const street2 = asString(body.street2 || "").trim();

  if (!street) throw new HttpError(400, "missing_street");
  if (!city) throw new HttpError(400, "missing_city");
  if (!state) throw new HttpError(400, "missing_state");
  if (!zip) throw new HttpError(400, "missing_zip");

  const addressRequest: AddressVerifyRequest = {
    street,
    city,
    state,
    zip,
    street2: street2 || undefined,
  };

  // Use Google Address Validation API
  let result: AddressVerifyResponse;

  if (env.GOOGLE_ADDRESS_VALIDATION_KEY) {
    result = await verifyAddressGoogle(env, addressRequest);
  } else {
    // No verification provider configured - return unknown (null = unknown)
    result = {
      verified: false,
      isResidential: null,
      provider: "none",
      deliveryPoint: "unknown",
      nearestHub: null,
    };
  }

  // If residential, find nearest freight hub for LTL shipping
  if (result.isResidential && zip) {
    const nearestHubs = findNearestFreightHubs(zip, state, 1);
    if (nearestHubs.length > 0) {
      const hub = nearestHubs[0]!;
      result.nearestHub = {
        name: hub.name,
        address: hub.address,
        city: hub.city,
        state: hub.state,
        zip: hub.zip,
        distance: hub.distance,
      };
    }
  }

  return json(result, { status: 200 });
}

// =============================================================================
// Email Quote System
// =============================================================================

interface QuoteItem {
  id: string;
  product_id: number;
  variant_id?: number;
  name: string;
  sku: string;
  quantity: number;
  price: { value: number; formatted: string };
  total: { value: number; formatted: string };
  image?: { data: string; alt: string };
  options?: Array<{
    name: string;
    value: string;
    nameId?: number;
    valueId?: number;
  }>;
  url?: string;
}

interface QuoteRequest {
  email: string;
  name?: string;
  phone?: string;
  notes?: string;
  storeUrl?: string;
  cart: {
    id?: string;
    items: QuoteItem[];
    subtotal: { value: number; formatted: string };
    discount?: { value: number; formatted: string };
    tax?: { value: number; formatted: string };
    grand_total: { value: number; formatted: string };
  };
  customerId?: number;
}

/**
 * Generate branded HTML email for quote
 */
function generateQuoteEmailHtml(
  quoteNumber: string,
  request: QuoteRequest,
  expiresAt: string,
  storefrontOrigin: string,
): string {
  const { cart, name, notes } = request;
  const customerName = name || "Valued Customer";
  const expirationDate = new Date(expiresAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const itemsHtml = cart.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px; border-bottom: 1px solid #e5e5e5;">
          <div style="display: flex; align-items: center; gap: 12px;">
            ${
              item.image?.data
                ? `<img src="${item.image.data}" alt="${item.image.alt || item.name}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 4px;" />`
                : ""
            }
            <div>
              <div style="font-weight: 600; color: #1a1a1a; margin-bottom: 4px;">${item.name}</div>
              ${item.sku ? `<div style="font-size: 12px; color: #666;">SKU: ${item.sku}</div>` : ""}
              ${
                item.options && item.options.length > 0
                  ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">
                      ${item.options.map((opt) => `${opt.name}: ${opt.value}`).join(" · ")}
                    </div>`
                  : ""
              }
            </div>
          </div>
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #e5e5e5; text-align: center; color: #666;">
          ${item.quantity}
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #e5e5e5; text-align: right; color: #666;">
          ${item.price.formatted}
        </td>
        <td style="padding: 16px; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600; color: #1a1a1a;">
          ${item.total.formatted}
        </td>
      </tr>
    `,
    )
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Quote from Trailer Parts Unlimited</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #e62223 0%, #f7931e 100%); padding: 32px 40px; border-radius: 8px 8px 0 0;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">
                      Trailer Parts Unlimited
                    </h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
                      Your Trusted Source for Trailer Parts
                    </p>
                  </td>
                  <td style="text-align: right;">
                    <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 4px; display: inline-block;">
                      <span style="color: #ffffff; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Quote</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Quote Info Banner -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 20px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <div style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Quote Number</div>
                    <div style="color: #ffffff; font-size: 18px; font-weight: 600; margin-top: 4px;">${quoteNumber}</div>
                  </td>
                  <td style="text-align: right;">
                    <div style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Valid Until</div>
                    <div style="color: #e62223; font-size: 14px; font-weight: 500; margin-top: 4px;">${expirationDate}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 40px 24px;">
              <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 20px; font-weight: 600;">
                Hi ${customerName},
              </h2>
              <p style="margin: 0; color: #666; font-size: 15px; line-height: 1.6;">
                Thank you for your interest in Trailer Parts Unlimited! Here's the quote you requested for your cart items. This quote is valid for 30 days.
              </p>
            </td>
          </tr>

          ${
            notes
              ? `
          <!-- Customer Notes -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <div style="background-color: #f8f9fa; border-left: 4px solid #e62223; padding: 16px; border-radius: 0 4px 4px 0;">
                <div style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Your Notes</div>
                <div style="color: #1a1a1a; font-size: 14px;">${notes}</div>
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
                    <th style="padding: 12px 16px; text-align: center; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 12px; font-weight: 600; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 24px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="280" style="margin-left: auto;">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${cart.subtotal.formatted}</td>
                </tr>
                ${
                  cart.discount && cart.discount.value > 0
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #22c55e;">Discount</td>
                  <td style="padding: 8px 0; text-align: right; color: #22c55e;">-${cart.discount.formatted}</td>
                </tr>
                `
                    : ""
                }
                ${
                  cart.tax && cart.tax.value > 0
                    ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Estimated Tax</td>
                  <td style="padding: 8px 0; text-align: right; color: #1a1a1a;">${cart.tax.formatted}</td>
                </tr>
                `
                    : ""
                }
                <tr>
                  <td colspan="2" style="padding-top: 12px; border-top: 2px solid #e5e5e5;"></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 18px; font-weight: 700; color: #1a1a1a;">Total</td>
                  <td style="padding: 8px 0; text-align: right; font-size: 18px; font-weight: 700; color: #e62223;">${cart.grand_total.formatted}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 16px 40px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center;">
                    <a href="https://cartertraileraxles.com/quote/cart/${quoteNumber}" style="display: inline-block; background: linear-gradient(135deg, #e62223 0%, #f7931e 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(230, 34, 35, 0.4);">
                      Complete Your Order
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center; padding-top: 16px;">
                    <p style="margin: 0; color: #999; font-size: 13px;">
                      Or call us at <a href="tel:+18448988687" style="color: #e62223; text-decoration: none; font-weight: 500;">844-898-8687</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="border-top: 1px solid #e5e5e5;"></div>
            </td>
          </tr>

          <!-- Why Choose Us -->
          <tr>
            <td style="padding: 32px 40px;">
              <h3 style="margin: 0 0 20px; color: #1a1a1a; font-size: 16px; font-weight: 600; text-align: center;">
                Why Choose Trailer Parts Unlimited?
              </h3>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="width: 33%; text-align: center; padding: 0 8px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">🚚</div>
                    <div style="font-size: 13px; color: #666; line-height: 1.4;">Fast Shipping on In-Stock Items</div>
                  </td>
                  <td style="width: 33%; text-align: center; padding: 0 8px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
                    <div style="font-size: 13px; color: #666; line-height: 1.4;">Quality Parts You Can Trust</div>
                  </td>
                  <td style="width: 33%; text-align: center; padding: 0 8px;">
                    <div style="font-size: 24px; margin-bottom: 8px;">💬</div>
                    <div style="font-size: 13px; color: #666; line-height: 1.4;">Expert Support Team</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 32px 40px; border-radius: 0 0 8px 8px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px; color: #ffffff; font-size: 14px; font-weight: 600;">
                      Trailer Parts Unlimited
                    </p>
                    <p style="margin: 0; color: #999; font-size: 13px; line-height: 1.6;">
                      Questions? Contact us at<br>
                      <a href="mailto:sales@trailerpartsunlimited.com" style="color: #e62223; text-decoration: none;">sales@trailerpartsunlimited.com</a><br>
                      <a href="tel:+18448988687" style="color: #e62223; text-decoration: none;">844-898-8687</a>
                    </p>
                  </td>
                  <td style="text-align: right; vertical-align: top;">
                    <a href="${storefrontOrigin}" style="color: #999; font-size: 13px; text-decoration: none;">
                      trailerpartsunlimited.com
                    </a>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 24px;">
                    <p style="margin: 0; color: #666; font-size: 11px; line-height: 1.5;">
                      This quote was generated based on your cart contents. Prices and availability are subject to change. 
                      Quote reference: ${quoteNumber}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text version of quote email
 */
function generateQuoteEmailText(
  quoteNumber: string,
  request: QuoteRequest,
  expiresAt: string,
  storefrontOrigin: string,
): string {
  const { cart, name, notes } = request;
  const customerName = name || "Valued Customer";
  const expirationDate = new Date(expiresAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const itemsList = cart.items
    .map(
      (item) =>
        `- ${item.name} (Qty: ${item.quantity}) - ${item.total.formatted}`,
    )
    .join("\n");

  return `
TRAILER PARTS UNLIMITED - QUOTE

Quote Number: ${quoteNumber}
Valid Until: ${expirationDate}

Hi ${customerName},

Thank you for your interest in Trailer Parts Unlimited! Here's the quote you requested:

${notes ? `YOUR NOTES:\n${notes}\n` : ""}
ITEMS:
${itemsList}

TOTALS:
Subtotal: ${cart.subtotal.formatted}
${cart.discount && cart.discount.value > 0 ? `Discount: -${cart.discount.formatted}\n` : ""}${cart.tax && cart.tax.value > 0 ? `Est. Tax: ${cart.tax.formatted}\n` : ""}Total: ${cart.grand_total.formatted}

Ready to complete your order? Visit: https://cartertraileraxles.com/quote/cart/${quoteNumber}

Or call us at 844-898-8687

---
Trailer Parts Unlimited
sales@trailerpartsunlimited.com
trailerpartsunlimited.com

This quote is valid for 30 days. Prices and availability subject to change.
  `.trim();
}

/**
 * Send email via Resend API
 */
async function sendEmailViaResend(
  env: Env,
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!env.RESEND_API_KEY) {
    throw new HttpError(
      501,
      "email_not_configured",
      "RESEND_API_KEY is not set",
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Trailer Parts Unlimited <cart@cartertraileraxles.com>",
      to: [to],
      subject,
      html,
      text,
      reply_to: "sales@trailerpartsunlimited.com",
      tags: [{ name: "type", value: "quote" }],
    }),
  });

  if (!response.ok) {
    const errorData = await safeJson(response);
    console.error("Resend API error:", errorData);
    return { success: false, error: "Failed to send email" };
  }

  const data = (await response.json()) as { id: string };
  return { success: true, messageId: data.id };
}

/**
 * Handle GET /quote/cart/:quoteNumber
 * Looks up a stored quote, creates a fresh BigCommerce cart with the quoted items,
 * and redirects the visitor to that cart. This avoids the session-cart problem where
 * `/cart.php` always shows the visitor's own cart rather than the quoted items.
 */
async function handleQuoteCart(
  req: Request,
  env: Env,
  quoteNumber: string,
): Promise<Response> {
  if (!env.BIGCOMMERCE_STORE_HASH || !env.BIGCOMMERCE_ACCESS_TOKEN) {
    return new Response("Store not configured", { status: 501 });
  }

  // Look up quote from Supabase
  const params = new URLSearchParams();
  params.set("select", "id,quote_number,items,expires_at");
  params.set("quote_number", `eq.${quoteNumber}`);
  const qr = await supabaseFetch(env, `quotes?${params.toString()}`, {
    method: "GET",
  });
  if (!qr.ok) {
    return new Response("Unable to load quote", { status: 502 });
  }
  const rows = (await qr.json()) as Array<{
    id: string;
    quote_number: string;
    items: QuoteItem[];
    expires_at: string;
  }>;
  const quote = rows[0];
  if (!quote) {
    return new Response("Quote not found", { status: 404 });
  }

  if (new Date(quote.expires_at) < new Date()) {
    return new Response("This quote has expired", { status: 410 });
  }

  // Build line items for BigCommerce Server-to-Server Cart API
  const lineItems = quote.items.map((item) => {
    const li: Record<string, unknown> = {
      product_id: item.product_id,
      quantity: item.quantity,
    };
    if (item.variant_id) {
      li.variant_id = item.variant_id;
    }
    if (
      item.options?.length &&
      item.options.some((o) => o.nameId && o.valueId)
    ) {
      li.option_selections = item.options
        .filter((o) => o.nameId && o.valueId)
        .map((o) => ({ option_id: o.nameId, option_value: o.valueId }));
    }
    return li;
  });

  // Create a new cart via BigCommerce V3 API
  const storeHash = env.BIGCOMMERCE_STORE_HASH;
  const createCartRes = await fetch(
    `https://api.bigcommerce.com/stores/${storeHash}/v3/carts`,
    {
      method: "POST",
      headers: {
        "X-Auth-Token": env.BIGCOMMERCE_ACCESS_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ line_items: lineItems }),
    },
  );

  if (!createCartRes.ok) {
    const err = await safeJson(createCartRes);
    console.error("BigCommerce create cart error:", err);
    return new Response("Unable to create cart", { status: 502 });
  }

  const cartData = (await createCartRes.json()) as { data: { id: string } };
  const cartId = cartData.data?.id;
  if (!cartId) {
    return new Response("Cart creation returned no ID", { status: 502 });
  }

  // Get redirect URLs for the new cart
  const redirectRes = await fetch(
    `https://api.bigcommerce.com/stores/${storeHash}/v3/carts/${cartId}/redirect_urls`,
    {
      method: "POST",
      headers: {
        "X-Auth-Token": env.BIGCOMMERCE_ACCESS_TOKEN,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  if (!redirectRes.ok) {
    const err = await safeJson(redirectRes);
    console.error("BigCommerce redirect URL error:", err);
    // Fall back to plain cart page if redirect URL creation fails
    return Response.redirect(`${env.STOREFRONT_ORIGIN}/cart.php`, 302);
  }

  const redirectData = (await redirectRes.json()) as {
    data: { cart_url: string; checkout_url: string };
  };
  const cartUrl = redirectData.data?.cart_url;
  if (!cartUrl) {
    return Response.redirect(`${env.STOREFRONT_ORIGIN}/cart.php`, 302);
  }

  return Response.redirect(cartUrl, 302);
}

/**
 * Handle POST /quote/send
 * Sends a branded quote email and stores it in Supabase
 */
async function handleSendQuote(req: Request, env: Env): Promise<Response> {
  const body = (await req.json().catch(() => null)) as null | QuoteRequest;
  if (!body) throw new HttpError(400, "invalid_json");

  // Validate required fields
  const email = asString(body.email).trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError(400, "invalid_email");
  }

  if (
    !body.cart ||
    !Array.isArray(body.cart.items) ||
    body.cart.items.length === 0
  ) {
    throw new HttpError(400, "empty_cart");
  }

  if (
    !body.cart.grand_total ||
    typeof body.cart.grand_total.value !== "number"
  ) {
    throw new HttpError(400, "invalid_cart_total");
  }

  const name = asString(body.name || "").trim();
  const phone = asString(body.phone || "").trim();
  const notes = asString(body.notes || "").trim();

  // Calculate expiration (30 days from now)
  const expiresAt = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  // Prepare quote data for Supabase
  const quoteData = {
    customer_email: email,
    customer_name: name || null,
    customer_phone: phone || null,
    customer_id: body.customerId || null,
    cart_id: body.cart.id || null,
    items: body.cart.items,
    subtotal: body.cart.subtotal?.value || 0,
    discount: body.cart.discount?.value || 0,
    tax: body.cart.tax?.value || 0,
    grand_total: body.cart.grand_total.value,
    expires_at: expiresAt,
    notes: notes || null,
    source: "cart",
    ip_address:
      req.headers.get("CF-Connecting-IP") ||
      req.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
      null,
    user_agent: req.headers.get("User-Agent")?.slice(0, 500) || null,
  };

  // Insert quote into Supabase (quote_number is auto-generated by trigger)
  const insertRes = await supabaseFetch(env, "quotes", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(quoteData),
  });

  if (!insertRes.ok) {
    const errorData = await safeJson(insertRes);
    console.error("Supabase insert error:", errorData);
    throw new HttpError(502, "database_error", "Failed to save quote");
  }

  const insertedQuotes = (await insertRes.json()) as Array<{
    id: string;
    quote_number: string;
  }>;
  const quote = insertedQuotes[0];

  if (!quote) {
    throw new HttpError(
      502,
      "database_error",
      "No quote returned from database",
    );
  }

  // Generate email content
  const emailHtml = generateQuoteEmailHtml(
    quote.quote_number,
    body,
    expiresAt,
    env.STOREFRONT_ORIGIN,
  );
  const emailText = generateQuoteEmailText(
    quote.quote_number,
    body,
    expiresAt,
    env.STOREFRONT_ORIGIN,
  );
  const subject = `Your Quote ${quote.quote_number} from Trailer Parts Unlimited`;

  // Send email via Resend
  const emailResult = await sendEmailViaResend(
    env,
    email,
    subject,
    emailHtml,
    emailText,
  );

  if (!emailResult.success) {
    // Update quote to mark email failed (but don't fail the request)
    console.error("Email send failed:", emailResult.error);
  } else {
    // Update quote with sent timestamp
    const updateParams = new URLSearchParams();
    updateParams.set("id", `eq.${quote.id}`);
    await supabaseFetch(env, `quotes?${updateParams.toString()}`, {
      method: "PATCH",
      body: JSON.stringify({ sent_at: new Date().toISOString() }),
    });
  }

  return json(
    {
      success: true,
      quoteId: quote.id,
      quoteNumber: quote.quote_number,
      email,
      expiresAt,
      emailSent: emailResult.success,
    },
    { status: 201 },
  );
}

function notFound(): Response {
  return json({ error: "not_found" }, { status: 404 });
}

export default {
  async fetch(
    req: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    try {
      // CORS preflight
      if (req.method === "OPTIONS") {
        return withCors(req, env, new Response(null, { status: 204 }));
      }

      // Strict CORS lockdown for browser-origin requests.
      // If Origin is present and not allowed, hard fail (prevents accidental embedding).
      const origin = req.headers.get("Origin");
      if (origin && !isAllowedOrigin(origin, env)) {
        return withCors(
          req,
          env,
          json({ error: "cors_denied" }, { status: 403 }),
        );
      }

      const url = new URL(req.url);
      const path = url.pathname.replace(/\/+$/, "") || "/";

      const ip = getClientIp(req);
      let authed: Authed | null = null;

      // Public POST endpoints that don't require authentication
      const publicPostEndpoints = [
        "/address/verify",
        "/freight/hubs",
        "/quote/send",
        "/auth/bc-exchange",
      ];
      const isPublicPost =
        req.method === "POST" && publicPostEndpoints.includes(path);

      // DELETE requires authentication (admin-only, checked in handlers)
      const isDelete = req.method === "DELETE";

      const isWrite = (req.method === "POST" && !isPublicPost) || isDelete;
      if (isWrite) {
        authed = await requireSupabaseJwt(req, env);
        // Tight write limits.
        await rateLimitOrThrow(env, `${ip}:${authed.userId}:write`, 20, 60);
      } else if (isPublicPost) {
        // Public POST endpoints - rate limit by IP only
        await rateLimitOrThrow(env, `${ip}:public:write`, 30, 60);
      } else {
        // Reads are rate limited by IP + (optional) user id.
        // If a JWT is present, we verify it and key by the user.
        const token = getBearer(req);
        if (token) {
          try {
            authed = await requireSupabaseJwt(req, env);
          } catch {
            // Ignore invalid JWTs for reads; treat as anonymous.
            authed = null;
          }
        }
        const userKey = authed?.userId ?? "anon";
        await rateLimitOrThrow(env, `${ip}:${userKey}:read`, 120, 60);
      }

      // Routes
      if (req.method === "GET" && path === "/threads") {
        return withCors(req, env, await handleThreadsFeed(req, env, ctx));
      }

      const threadIdMatch = /^\/threads\/([^/]+)$/.exec(path);
      if (req.method === "GET" && threadIdMatch) {
        return withCors(
          req,
          env,
          await handleGetThread(
            req,
            env,
            ctx,
            decodeURIComponent(threadIdMatch[1]!),
          ),
        );
      }

      if (req.method === "POST" && path === "/threads") {
        return withCors(req, env, await handleCreateThread(req, env, authed!));
      }

      // Admin endpoint: check admin status (requires auth)
      if (req.method === "GET" && path === "/admin/me") {
        // This needs auth, so verify JWT
        if (!authed) {
          authed = await requireSupabaseJwt(req, env);
        }
        return withCors(req, env, await handleAdminMe(req, env, authed));
      }

      // Admin list: public endpoint for frontend to determine admin badges
      if (req.method === "GET" && path === "/admin/list") {
        return withCors(req, env, await handleAdminList(req, env, ctx));
      }

      // Admin: Delete thread
      if (req.method === "DELETE" && threadIdMatch) {
        return withCors(
          req,
          env,
          await handleDeleteThread(
            req,
            env,
            authed!,
            decodeURIComponent(threadIdMatch[1]!),
          ),
        );
      }

      const threadVoteMatch = /^\/threads\/([^/]+)\/vote$/.exec(path);
      if (req.method === "POST" && threadVoteMatch) {
        return withCors(
          req,
          env,
          await handleVoteThread(
            req,
            env,
            authed!,
            decodeURIComponent(threadVoteMatch[1]!),
          ),
        );
      }

      const threadCommentsMatch = /^\/threads\/([^/]+)\/comments$/.exec(path);
      if (req.method === "GET" && threadCommentsMatch) {
        return withCors(
          req,
          env,
          await handleGetThreadComments(
            req,
            env,
            ctx,
            decodeURIComponent(threadCommentsMatch[1]!),
          ),
        );
      }
      if (req.method === "POST" && threadCommentsMatch) {
        return withCors(
          req,
          env,
          await handleCreateComment(
            req,
            env,
            authed!,
            decodeURIComponent(threadCommentsMatch[1]!),
          ),
        );
      }

      const commentVoteMatch = /^\/comments\/([^/]+)\/vote$/.exec(path);
      if (req.method === "POST" && commentVoteMatch) {
        return withCors(
          req,
          env,
          await handleVoteComment(
            req,
            env,
            authed!,
            decodeURIComponent(commentVoteMatch[1]!),
          ),
        );
      }

      // Admin: Delete comment
      const commentIdMatch = /^\/comments\/([^/]+)$/.exec(path);
      if (req.method === "DELETE" && commentIdMatch) {
        return withCors(
          req,
          env,
          await handleDeleteComment(
            req,
            env,
            authed!,
            decodeURIComponent(commentIdMatch[1]!),
          ),
        );
      }

      const commentAcceptMatch = /^\/comments\/([^/]+)\/accept$/.exec(path);
      if (req.method === "POST" && commentAcceptMatch) {
        return withCors(
          req,
          env,
          await handleAcceptComment(
            req,
            env,
            authed!,
            decodeURIComponent(commentAcceptMatch[1]!),
          ),
        );
      }

      const relatedKitsMatch = /^\/threads\/([^/]+)\/related-kits$/.exec(path);
      if (req.method === "GET" && relatedKitsMatch) {
        return withCors(
          req,
          env,
          await handleRelatedKits(
            req,
            env,
            ctx,
            decodeURIComponent(relatedKitsMatch[1]!),
          ),
        );
      }

      // Auth: BigCommerce Customer Login (requires Supabase JWT)
      if (req.method === "POST" && path === "/auth/bc-login") {
        return withCors(req, env, await handleBCLogin(req, env, authed!));
      }

      // Auth: Exchange BigCommerce customer identity for forum JWT
      // Note: This endpoint doesn't require a bearer token - it verifies BC customer data directly
      if (req.method === "POST" && path === "/auth/bc-exchange") {
        return withCors(req, env, await handleBCExchange(req, env));
      }

      // Address Verification (Residential/Commercial)
      // Note: This endpoint doesn't require authentication - it's rate limited by IP
      if (req.method === "POST" && path === "/address/verify") {
        return withCors(req, env, await handleAddressVerify(req, env));
      }

      // Freight Hub Lookup (for LTL shipments)
      if (req.method === "POST" && path === "/freight/hubs") {
        return withCors(req, env, await handleFreightHubs(req, env));
      }

      // Email Quote System
      if (req.method === "POST" && path === "/quote/send") {
        return withCors(req, env, await handleSendQuote(req, env));
      }

      // Quote → Cart redirect (linked from quote emails, no CORS needed)
      const quoteCartMatch = /^\/quote\/cart\/([^/]+)$/.exec(path);
      if (req.method === "GET" && quoteCartMatch) {
        return handleQuoteCart(
          req,
          env,
          decodeURIComponent(quoteCartMatch[1]!),
        );
      }

      return withCors(req, env, notFound());
    } catch (err) {
      const e = err as unknown;
      if (e instanceof HttpError) {
        return withCors(
          req,
          env,
          json({ error: e.code, details: e.details }, { status: e.status }),
        );
      }
      // Log unexpected errors for debugging
      console.error(
        "Unexpected error:",
        e instanceof Error ? e.message : e,
        e instanceof Error ? e.stack : "",
      );
      return withCors(
        req,
        env,
        json({ error: "internal_error" }, { status: 500 }),
      );
    }
  },
};
