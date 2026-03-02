# Deploy Forum API Worker

## Option 1: Deploy to workers.dev (Quick Start)

1. Register a workers.dev subdomain:
   - Go to: https://dash.cloudflare.com/598c6319bb269b28dc532be9280bc84f/workers/onboarding
   - Or in Cloudflare Dashboard → Workers & Pages → Manage Workers → Register subdomain
   - Choose a subdomain (e.g., `forum-api`)

2. Deploy:
   ```bash
   cd workers/forum-api
   wrangler deploy
   ```

3. Your API will be at: `https://forum-api.{your-subdomain}.workers.dev`

## Option 2: Deploy to Custom Domain Route /forum/*

**Prerequisites:**
- Your domain (`trailerpartsunlimited.com`) must be managed by Cloudflare
- DNS must be proxied through Cloudflare (orange cloud)

**Steps:**

1. Uncomment routes in `wrangler.toml`:
   ```toml
   routes = [
     { pattern = "trailerpartsunlimited.com/forum/*", zone_name = "trailerpartsunlimited.com" }
   ]
   ```

2. Deploy:
   ```bash
   cd workers/forum-api
   wrangler deploy
   ```

3. Your API will be at: `https://trailerpartsunlimited.com/forum/*`

## Option 3: Configure Route After Deployment

1. Deploy to workers.dev first (Option 1)
2. In Cloudflare Dashboard:
   - Go to Workers & Pages → forum-api
   - Click Settings → Triggers
   - Under Routes, click Add route
   - Pattern: `trailerpartsunlimited.com/forum/*`
   - Zone: `trailerpartsunlimited.com`
   - Save

---

## Current Status

✅ All secrets configured  
✅ KV namespace created  
✅ Configuration ready  
⏳ Need to register workers.dev subdomain OR configure custom domain route

---

## Test After Deployment

```bash
# Test threads endpoint
curl https://your-worker-url/threads

# Should return JSON (may be empty array if no threads)
```









