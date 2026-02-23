# OKR Pulse — Deployment Guide
## Step-by-step for non-technical users

This guide will get your app live in about 30–45 minutes.
You'll use three free services: GitHub, Supabase, and Vercel.

---

## STEP 1: Set Up Supabase (your database & login system)

1. Go to **https://supabase.com** → Sign up (free)
2. Click **"New Project"** → Give it a name like `okr-pulse`
3. Set a strong database password → Save it somewhere safe
4. Wait ~2 minutes for it to set up

### Run the database schema:
5. In Supabase, go to **SQL Editor** (left sidebar)
6. Click **"New query"**
7. Open the file `supabase-schema.sql` from this project
8. Copy the entire contents → Paste into the SQL editor → Click **Run**

### Get your API keys:
9. Go to **Settings → API** in Supabase
10. Copy these 3 values (you'll need them later):
    - `Project URL` → this is your `SUPABASE_URL`
    - `anon / public` key → this is your `SUPABASE_ANON_KEY`
    - `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### Create your admin account:
11. Go to **Authentication → Users** in Supabase
12. Click **"Add user"** → Enter YOUR email and password
13. This is your admin/executive login

---

## STEP 2: Get an Anthropic API Key (for AI reports)

1. Go to **https://console.anthropic.com** → Sign up
2. Go to **API Keys** → Create a new key
3. Copy it → this is your `ANTHROPIC_API_KEY`
4. Cost: Roughly $0.01–$2/month for your usage. Very cheap.

---

## STEP 3: Upload Code to GitHub

1. Go to **https://github.com** → Sign up (free)
2. Click **"New repository"** → Name it `okr-pulse` → Click Create
3. Download **GitHub Desktop** from https://desktop.github.com
4. Open GitHub Desktop → Clone your new repository to your computer
5. Copy ALL files from this `okr-app` folder into the cloned folder
6. In GitHub Desktop: write a commit message like "Initial commit" → Click **Commit** → **Push**

---

## STEP 4: Deploy to Vercel

1. Go to **https://vercel.com** → Sign up with your GitHub account
2. Click **"Add New Project"**
3. Find and select your `okr-pulse` repository → Click **Import**
4. Before clicking Deploy, click **"Environment Variables"**
5. Add these one by one:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | your Supabase service role key |
| `ANTHROPIC_API_KEY` | your Anthropic API key |
| `ADMIN_EMAIL` | your email address (the admin) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | same email as above |

6. Click **Deploy** → Wait ~2 minutes
7. Vercel will give you a URL like `https://okr-pulse-xyz.vercel.app`

**That's your app! 🎉**

---

## STEP 5: Log In & Set Up

1. Go to your Vercel URL
2. Log in with your admin email and password (from Supabase Step 1)
3. You'll land on the **Admin Dashboard**

### Add your employees:
4. Go to **Employees** in the top nav
5. Add each employee — fill in their name, email, entity, and a temporary password
6. Send them the app URL + their login credentials

### Create OKRs:
7. Go to **Manage OKRs**
8. Create OKRs and assign them to employees

---

## STEP 6: How It Works Weekly

- Every Monday–Sunday = one week cycle
- Employees log in, see their assigned OKRs, submit a short/long update + score (1–5)
- You check the **Dashboard** to see who's submitted
- On Friday (or whenever), go to **AI Report** → click Generate → get a full executive summary

---

## Troubleshooting

**Login doesn't work?**
→ Make sure `ADMIN_EMAIL` matches exactly the email you used in Supabase

**"Database error" when adding employees?**
→ Make sure you ran the SQL schema in Supabase (Step 1)

**AI Report not generating?**
→ Check that `ANTHROPIC_API_KEY` is set correctly in Vercel

**Need help?** The Supabase and Vercel documentation are excellent:
- https://supabase.com/docs
- https://vercel.com/docs

---

## Cost Summary (Monthly)

| Service | Cost |
|---------|------|
| Supabase (free tier) | $0 |
| Vercel (free tier) | $0 |
| Anthropic API (12 users, weekly reports) | ~$1–3 |
| **Total** | **< $5/month** |
