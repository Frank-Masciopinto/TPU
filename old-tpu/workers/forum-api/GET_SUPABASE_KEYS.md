# How to Get Correct Supabase Keys

The keys you provided don't match Supabase's format. Follow these steps to get the correct ones:

## Step 1: Login to Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: `fmnjbhcgzxvcjctafscu`

## Step 2: Get API Keys

1. In the left sidebar, click **Settings** (gear icon)
2. Click **API** in the settings menu
3. You'll see a section called **Project API keys**

## Step 3: Find the Correct Keys

You should see **two** keys:

### 1. `anon` `public` key
- **What it looks like**: Starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Label**: Usually says "anon" or "public"
- **This is**: `SUPABASE_ANON_KEY`
- **Copy this one** ✅

### 2. `service_role` `secret` key  
- **What it looks like**: Also starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (but different)
- **Label**: Usually says "service_role" or "secret"
- **⚠️ DO NOT USE THIS ONE** - It has admin access

## Step 4: Get JWT Secret

1. Still in **Settings** → **API**
2. Scroll down to **JWT Settings** section
3. Find **JWT Secret**
4. Click **Reveal** if it's hidden
5. **Copy this value** → This is `SUPABASE_JWT_SECRET`
6. It's a long string (not a JWT token)

## What You Need

After following these steps, you should have:

1. ✅ **SUPABASE_URL**: `https://fmnjbhcgzxvcjctafscu.supabase.co` (already set)
2. ⬜ **SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (get from Step 3)
3. ⬜ **SUPABASE_JWT_SECRET**: Long string (get from Step 4)

## Note About the Keys You Shared

The keys you shared (`sb_publishable_...` and `sb_secret_...`) look like they might be from:
- Stripe (payment service)
- Or another service

Supabase keys are **JWT tokens** that start with `eyJ...` (for anon/service_role keys) or long strings (for JWT secret).

## Security Warning

⚠️ **You just shared secrets in plain text!** 

After we set everything up, consider:
1. Rotating your Supabase JWT secret (if you shared the real one)
2. Using environment variables or secret management
3. Never committing secrets to git

---

Once you have the correct keys, we'll update `wrangler.toml` and set the secrets.









