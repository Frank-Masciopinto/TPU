# Forum Image Upload — Deploy Checklist

Manual steps required before the image upload feature is live in production.

---

## 1. Create R2 Bucket

From `old-tpu/workers/forum-api/`:

```bash
npx wrangler r2 bucket create tpu-forum-images
```

## 2. Configure Public Access

In the Cloudflare dashboard:

1. Go to **R2 > tpu-forum-images > Settings > Custom Domains**
2. Add `forum-images.cartertraileraxles.com`
3. In **DNS**, add a CNAME record for `forum-images` pointing to the R2 bucket

Alternative (quick start): R2 > bucket > Settings > R2.dev subdomain > Allow Access. If using r2.dev, update `R2_PUBLIC_PREFIX` in `src/index.ts` to match the assigned URL.

## 3. Smoke Test the Public URL

```bash
# Upload a test file
npx wrangler r2 object put tpu-forum-images/test.txt --file wrangler.toml

# Verify it's publicly accessible
curl -I https://forum-images.cartertraileraxles.com/test.txt
# Should return HTTP 200

# Clean up
npx wrangler r2 object delete tpu-forum-images/test.txt
```

## 4. Run the SQL Migration on Supabase

In the Supabase SQL Editor (or via CLI), run:

```sql
ALTER TABLE threads ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE comments ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
```

Migration file: `supabase/migrations/20260310120000_add_forum_images.sql`

## 5. Check Storefront CSP Headers

Inspect the response headers on `trailerpartsunlimited.com` for `Content-Security-Policy`. If `img-src` is restricted, add the R2 domain:

```
img-src 'self' https://forum-images.cartertraileraxles.com ...;
```

If no CSP header exists, no action needed.

## 6. Deploy Worker

From `old-tpu/workers/forum-api/`:

```bash
npx wrangler deploy
```

Verify the upload endpoint responds:

```bash
curl -X POST https://cartertraileraxles.com/upload/image \
  -H "Authorization: Bearer <test-token>" \
  -F "file=@/path/to/test.jpg"
```

## 7. Build and Deploy Theme to BigCommerce

From `old-tpu/`:

```bash
npm run build
stencil push
```

---

## Post-Deploy Verification

- [ ] Upload an image via the Ask Question drawer — confirm it appears in the thread
- [ ] Reply with an image — confirm it renders in the comment
- [ ] Verify old threads/comments without images still render normally
- [ ] Admin delete a thread with images — confirm R2 objects are cleaned up
- [ ] Check the feed for the "photos" badge on threads with images
- [ ] Test on mobile (iOS Safari, Android Chrome)
- [ ] Monitor Worker logs for 48 hours for errors
