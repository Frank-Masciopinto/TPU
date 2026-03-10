# Forum Image Upload — Deploy Checklist

Manual steps required before the image upload feature is live in production.

---

## 1. Create R2 Bucket

From `old-tpu/workers/forum-api/`:

```bash
npx wrangler r2 bucket create tpu-forum-images
```

## 2. Image Serving (Worker Proxy)

Images are served by the Worker—no R2 custom domain needed. New uploads return URLs like `https://cartertraileraxles.com/forum-images/forum/...`. Existing URLs (`forum-images.cartertraileraxles.com`) are proxied via the Worker route.

**DNS:** Ensure `forum-images.cartertraileraxles.com` resolves (CNAME to the zone or Worker). If the zone is on Cloudflare, the Worker route in `wrangler.toml` will receive traffic.

**Optional:** R2 > bucket > Custom Domains for direct serving. Not required; the Worker proxy is sufficient.

## 3. Run the SQL Migration on Supabase

In the Supabase SQL Editor (or via CLI), run:

```sql
ALTER TABLE threads ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
ALTER TABLE comments ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
```

Migration file: `supabase/migrations/20260310120000_add_forum_images.sql`

## 4. Check Storefront CSP Headers

Inspect the response headers on `trailerpartsunlimited.com` for `Content-Security-Policy`. If `img-src` is restricted, add:

```
img-src 'self' https://cartertraileraxles.com https://forum-images.cartertraileraxles.com ...;
```

If no CSP header exists, no action needed.

## 5. Deploy Worker

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

## 6. Build and Deploy Theme to BigCommerce

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
