## Forum API Worker (Cloudflare)

This Worker is an API gateway in front of **Supabase** (PostgREST) + **BigCommerce**.

### Endpoints

- `GET  /threads?sort=&q=&tags=&page=`
- `GET  /threads/:id`
- `POST /threads`
- `POST /threads/:id/vote`
- `GET  /threads/:id/comments`
- `POST /threads/:id/comments`
- `POST /comments/:id/vote`
- `POST /comments/:id/accept`
- `GET  /threads/:id/related-kits`

### Security guarantees

- **No secrets shipped to the browser**: Supabase JWT secret + BigCommerce token live only in Worker secrets.
- **Writes require verified Supabase JWT** (`Authorization: Bearer <jwt>`).
- **Rate limiting**: KV-based, keyed by IP (+ user id for writes).
- **CORS lockdown**: only `STOREFRONT_ORIGIN` is allowed for browser requests.

### Required bindings / env

In `wrangler.toml`:

- `STOREFRONT_ORIGIN` (exact origin match)
- `SUPABASE_URL` (e.g. `https://xxx.supabase.co`)
- `SUPABASE_ANON_KEY`
- `BIGCOMMERCE_STORE_HASH`
- KV binding: `RATE_LIMIT_KV`

Set secrets:

- `SUPABASE_JWT_SECRET`
- `BIGCOMMERCE_ACCESS_TOKEN`

### Supabase table expectations

This Worker assumes PostgREST tables exist (names can be adjusted in `src/index.ts`):

- `threads` (expects fields like `id`, `title`, `body`, `created_at`, `score`, `accepted_comment_id`, `tags`, `user_id`)
- `comments` (expects fields like `id`, `thread_id`, `body`, `created_at`, `score`, `user_id`)
- `thread_votes` (expects `thread_id`, `user_id`, `value` with unique constraint on `(thread_id, user_id)`)
- `comment_votes` (expects `comment_id`, `user_id`, `value` with unique constraint on `(comment_id, user_id)`)

Voting/accept relies on your Supabase schema (RLS + triggers/views) to keep `score`, `comment_count`, etc. consistent.

