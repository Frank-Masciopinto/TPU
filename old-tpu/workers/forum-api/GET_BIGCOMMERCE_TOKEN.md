# Get BigCommerce Access Token

Your store hash is already configured: `2wzik2aols`

Now you need to create an API access token.

## Step 1: Login to BigCommerce Admin

1. Go to: https://store-2wzik2aols.mybigcommerce.com/manage/dashboard
2. Login with your credentials

## Step 2: Navigate to API Accounts

1. In the left sidebar, go to **Advanced Settings**
2. Click **API Accounts** (or **Storefront API Tokens**)

## Step 3: Create API Account/Token

1. Click **Create API Account** (or **Create Token**)
2. Fill in the form:
   - **Token Name**: `Forum API Worker`
   - **Token Description**: `API access for forum-related kits feature`
   - **API Path**: Leave default or select **Storefront API**

## Step 4: Set OAuth Scopes

Select these scopes (minimum required):

- ✅ **Products** → **Read-only**
- ✅ **Store Information** → **Read-only**

**Note**: Only select read-only scopes for security. The forum feature only needs to read product information.

## Step 5: Save and Copy Token

1. Click **Save** or **Create Token**
2. **⚠️ IMPORTANT**: Copy the token immediately! You won't be able to see it again.
3. The token will look something like: `abc123def456ghi789...` (long string)

## Step 6: Set Token as Secret

Once you have the token, run:

```bash
cd workers/forum-api
wrangler secret put BIGCOMMERCE_ACCESS_TOKEN
```

When prompted, paste your token and press Enter.

## Verify Token Was Set

```bash
wrangler secret list
```

You should see both secrets:
- `SUPABASE_JWT_SECRET`
- `BIGCOMMERCE_ACCESS_TOKEN`

---

## Alternative: If You Already Have a Token

If you already have a BigCommerce API token, you can use that instead of creating a new one. Just make sure it has:
- Products (read) scope
- Store Information (read) scope

---

## Security Note

⚠️ **Never share your API token publicly!** It provides access to your store's data.

The token will be stored securely in Cloudflare and never exposed in your code.









