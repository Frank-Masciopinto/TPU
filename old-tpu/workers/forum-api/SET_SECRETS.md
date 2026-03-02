# Set Cloudflare Secrets

Now that we have the Supabase keys, set the JWT secret securely in Cloudflare.

## Step 1: Navigate to Forum API Directory

```bash
cd workers/forum-api
```

## Step 2: Set Supabase JWT Secret

Run this command:

```bash
wrangler secret put SUPABASE_JWT_SECRET
```

When prompted, paste this value:
```
c8be5dc0-7ff8-446b-9c66-7ce3418883f9
```

Press Enter to confirm.

## Step 3: Verify Secret Was Set

You can verify it was set (but won't see the value):

```bash
wrangler secret list
```

You should see `SUPABASE_JWT_SECRET` in the list.

---

## What's Already Configured

✅ **SUPABASE_URL** - Set in `wrangler.toml`  
✅ **SUPABASE_ANON_KEY** - Set in `wrangler.toml`  
✅ **SUPABASE_JWT_SECRET** - Set via `wrangler secret put` (Step 2 above)

---

## Still Needed

- [ ] BigCommerce Store Hash
- [ ] BigCommerce Access Token (set as secret)
- [ ] Cloudflare KV Namespace IDs

---

## Security Reminder

⚠️ **You've shared secrets in plain text multiple times!**

After setup is complete, consider:
1. Rotating your Supabase JWT secret (Settings → API → Reset JWT Secret)
2. Using a password manager for secrets
3. Never committing secrets to git (they're already in `.gitignore`)

The secrets are now safely stored in Cloudflare and won't be exposed in your code.









