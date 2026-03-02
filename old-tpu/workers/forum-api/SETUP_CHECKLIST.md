# Forum API Setup Checklist

Use this checklist to track your progress setting up the forum feature.

## Supabase Setup

- [ ] Created/accessed Supabase account
- [ ] Created new project (or selected existing)
- [ ] Copied `SUPABASE_URL` from Settings → API
- [ ] Copied `SUPABASE_ANON_KEY` (anon/public key)
- [ ] Copied `SUPABASE_JWT_SECRET` (from JWT Settings)

**Values:**
- SUPABASE_URL: `_________________________________`
- SUPABASE_ANON_KEY: `_________________________________`
- SUPABASE_JWT_SECRET: `_________________________________` (set as secret)

## BigCommerce Setup

- [ ] Logged into BigCommerce admin
- [ ] Found store hash from URL or API Accounts page
- [ ] Created API account/token (or used existing)
- [ ] Verified token has Products (read) and Store Info (read) scopes
- [ ] Copied `BIGCOMMERCE_STORE_HASH`
- [ ] Copied `BIGCOMMERCE_ACCESS_TOKEN`

**Values:**
- BIGCOMMERCE_STORE_HASH: `_________________________________`
- BIGCOMMERCE_ACCESS_TOKEN: `_________________________________` (set as secret)

## Cloudflare KV Setup

- [ ] Logged into Cloudflare dashboard
- [ ] Created KV namespace: `RATE_LIMIT_KV` (production)
- [ ] Created KV namespace: `RATE_LIMIT_KV` (preview)
- [ ] Copied production namespace ID
- [ ] Copied preview namespace ID

**Values:**
- KV Production ID: `_________________________________`
- KV Preview ID: `_________________________________`

## Configuration

- [ ] Updated `wrangler.toml` with all variables
- [ ] Set `SUPABASE_JWT_SECRET` via `wrangler secret put`
- [ ] Set `BIGCOMMERCE_ACCESS_TOKEN` via `wrangler secret put`
- [ ] Verified `STOREFRONT_ORIGIN` is correct

## Deployment

- [ ] Tested locally with `wrangler dev` (optional)
- [ ] Deployed Worker with `wrangler deploy`
- [ ] Tested API endpoint (GET /threads)
- [ ] Updated frontend to use Worker URL

## Database Setup

- [ ] Applied Supabase migrations from `supabase/migrations/`
- [ ] Configured Row Level Security (RLS) policies
- [ ] Tested database connection

## Final Verification

- [ ] Forum loads on storefront
- [ ] Can create threads
- [ ] Can post comments
- [ ] Voting works
- [ ] Rate limiting works
- [ ] CORS is configured correctly

---

**Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete









