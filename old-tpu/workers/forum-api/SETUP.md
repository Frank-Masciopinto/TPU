# Forum API Setup Guide

This guide walks you through obtaining all required secrets and environment variables for the forum feature.

## Prerequisites

- Cloudflare account with Workers enabled
- Supabase account (or create one at https://supabase.com)
- BigCommerce store admin access
- `wrangler` CLI installed (`npm install -g wrangler`)

---

## Step 1: Get Supabase Credentials

### 1.1 Create/Login to Supabase
1. Go to https://supabase.com
2. Sign in or create a free account
3. Create a new project (or select existing one)

### 1.2 Get Supabase URL
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Find **Project URL** (looks like `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`)
3. Copy this value → This is your `SUPABASE_URL`

### 1.3 Get Supabase Anonymous Key
1. In the same **Settings** → **API** page
2. Find **Project API keys** section
3. Copy the **`anon` `public`** key (starts with `eyJ...`)
4. **Important**: Use the `anon` key, NOT the `service_role` key
5. Copy this value → This is your `SUPABASE_ANON_KEY`

### 1.4 Get Supabase JWT Secret
1. In Supabase dashboard, go to **Settings** → **API**
2. Scroll down to **JWT Settings** section
3. Find **JWT Secret** (click "Reveal" if hidden)
4. Copy this value → This is your `SUPABASE_JWT_SECRET`
5. **Keep this secret!** Never expose it in client-side code.

---

## Step 2: Get BigCommerce Credentials

### 2.1 Get Store Hash
1. Login to your BigCommerce admin panel: https://login.bigcommerce.com
2. Go to **Advanced Settings** → **API Accounts**
3. Or check your store URL: `https://store-XXXXXX.mybigcommerce.com`
   - The `XXXXXX` part is your store hash
4. Copy this value → This is your `BIGCOMMERCE_STORE_HASH`

### 2.2 Create API Token (if you don't have one)
1. In BigCommerce admin, go to **Advanced Settings** → **API Accounts**
2. Click **Create API Account**
3. Fill in:
   - **Token Name**: `Forum API Worker`
   - **Token Description**: `API access for forum-related kits feature`
4. Under **OAuth Scopes**, select:
   - ✅ **Products** → **Read-only**
   - ✅ **Store Information** → **Read-only**
5. Click **Save**
6. **Important**: Copy the token immediately (you won't see it again!)
7. Copy this value → This is your `BIGCOMMERCE_ACCESS_TOKEN`

---

## Step 3: Create Cloudflare KV Namespace

### 3.1 Login to Cloudflare
1. Go to https://dash.cloudflare.com
2. Login to your account
3. Select your account/zone

### 3.2 Create KV Namespace via Dashboard
1. Go to **Workers & Pages** → **KV**
2. Click **Create a namespace**
3. Name it: `RATE_LIMIT_KV`
4. Click **Add**
5. Copy the **Namespace ID** (looks like `abc123def456...`)
6. Click **Add** again to create preview namespace
7. Name it: `RATE_LIMIT_KV` (same name)
8. Copy the **Preview Namespace ID**

### 3.3 Alternative: Create via Wrangler CLI
```bash
# Create production namespace
wrangler kv:namespace create "RATE_LIMIT_KV"

# Create preview namespace
wrangler kv:namespace create "RATE_LIMIT_KV" --preview
```

Copy the IDs from the output.

---

## Step 4: Configure wrangler.toml

Edit `workers/forum-api/wrangler.toml`:

```toml
[vars]
STOREFRONT_ORIGIN = "https://trailerpartsunlimited.com"  # Already set
SUPABASE_URL = "https://your-project-id.supabase.co"     # From Step 1.2
SUPABASE_ANON_KEY = "eyJhbGc..."                        # From Step 1.3
BIGCOMMERCE_STORE_HASH = "abc123"                        # From Step 2.1

[[kv_namespaces]]
binding = "RATE_LIMIT_KV"
id = "your-production-kv-namespace-id"                   # From Step 3.2
preview_id = "your-preview-kv-namespace-id"             # From Step 3.2
```

---

## Step 5: Set Cloudflare Secrets

Run these commands in the `workers/forum-api/` directory:

```bash
cd workers/forum-api

# Set Supabase JWT Secret
wrangler secret put SUPABASE_JWT_SECRET
# When prompted, paste the JWT secret from Step 1.4

# Set BigCommerce Access Token
wrangler secret put BIGCOMMERCE_ACCESS_TOKEN
# When prompted, paste the access token from Step 2.2
```

**Note**: Secrets are stored securely in Cloudflare and never exposed in code.

---

## Step 6: Verify Setup

### 6.1 Test Locally (Optional)
```bash
cd workers/forum-api
wrangler dev
```

### 6.2 Deploy to Cloudflare
```bash
cd workers/forum-api
wrangler deploy
```

### 6.3 Test API Endpoint
After deployment, test the API:
```bash
curl https://forum-api.your-subdomain.workers.dev/threads
```

You should get a JSON response (may be empty if no threads exist yet).

---

## Step 7: Configure Frontend API Base URL

Update your frontend code to point to the deployed Worker:

In `assets/js/components/forum/ForumApp.jsx` or wherever you initialize the forum API:

```javascript
const forumConfig = {
  apiBase: 'https://forum-api.your-subdomain.workers.dev'
};
```

Or set it via environment variable if using a build system.

---

## Security Checklist

- ✅ `SUPABASE_URL` - Safe to expose (public)
- ✅ `SUPABASE_ANON_KEY` - Safe to expose (public, but keep server-side)
- ❌ `SUPABASE_JWT_SECRET` - **NEVER expose** (set as secret)
- ✅ `BIGCOMMERCE_STORE_HASH` - Safe to expose (public)
- ❌ `BIGCOMMERCE_ACCESS_TOKEN` - **NEVER expose** (set as secret)
- ✅ `STOREFRONT_ORIGIN` - Safe to expose (public)

---

## Troubleshooting

### "Invalid JWT" errors
- Verify `SUPABASE_JWT_SECRET` matches your Supabase project's JWT secret
- Check that tokens are being signed with HS256 algorithm

### "CORS" errors
- Verify `STOREFRONT_ORIGIN` matches your exact storefront URL (including protocol)
- Check that the Worker is deployed and accessible

### "Rate limit" errors
- Verify KV namespace IDs are correct in `wrangler.toml`
- Check that KV namespace exists in your Cloudflare account

### "BigCommerce API" errors
- Verify `BIGCOMMERCE_STORE_HASH` is correct
- Verify `BIGCOMMERCE_ACCESS_TOKEN` has correct scopes
- Check token hasn't expired (tokens don't expire, but verify it's active)

---

## Quick Reference

| Variable | Where to Get | Type | Secret? |
|----------|-------------|------|---------|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API | var | No |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | var | No |
| `SUPABASE_JWT_SECRET` | Supabase Dashboard → Settings → API | secret | **Yes** |
| `BIGCOMMERCE_STORE_HASH` | BigCommerce Admin → Store URL | var | No |
| `BIGCOMMERCE_ACCESS_TOKEN` | BigCommerce Admin → API Accounts | secret | **Yes** |
| `RATE_LIMIT_KV` | Cloudflare Dashboard → Workers → KV | binding | No |

---

## Next Steps

1. Set up Supabase database tables (see `supabase/migrations/` folder)
2. Configure Row Level Security (RLS) policies
3. Deploy the Worker
4. Test forum functionality on your storefront

For database setup, see: `supabase/RLS_NOTES.md`









