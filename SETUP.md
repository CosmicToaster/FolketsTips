# FolketsTips — Setup Guide

This guide walks you through deploying FolketsTips from scratch: database, Google OAuth, and Vercel hosting.

---

## Overview of what you need

| Service | Purpose | Cost |
|---|---|---|
| [Neon](https://neon.tech) | PostgreSQL database | Free tier available |
| [Google Cloud Console](https://console.cloud.google.com) | OAuth login | Free |
| [Vercel](https://vercel.com) | Hosting the Next.js app | Free tier available |

---

## Step 1 — PostgreSQL Database (Neon)

Neon is recommended because Vercel also offers Postgres but Neon's free tier is more generous.

### 1.1 Create a Neon account
1. Go to [neon.tech](https://neon.tech) and sign up (GitHub login works).
2. Click **New Project**.
3. Name it `folketstips` (or anything you like), pick a region close to your users.
4. Click **Create Project**.

### 1.2 Get your connection strings
After the project is created:

1. Open the **Dashboard** of your new project.
2. Click **Connection Details** (or the connection string dropdown).
3. Select the **`main`** branch and your database.
4. Copy the two connection strings — you'll need them as environment variables:

```
# Pooled connection (for Prisma in serverless / Vercel)
POSTGRES_PRISMA_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15

# Direct connection (for migrations)
POSTGRES_URL_NON_POOLING=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

> **Note:** The app also accepts `DATABASE_URL` as a fallback, but `POSTGRES_PRISMA_URL` is preferred.

---

## Step 2 — Google OAuth

The app uses Google as its only login provider via NextAuth.

### 2.1 Create a Google Cloud project
1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Click the project dropdown at the top → **New Project**.
3. Name it `FolketsTips`, click **Create**.

### 2.2 Enable the Google+ API
1. In the left sidebar: **APIs & Services → Library**.
2. Search for **Google+ API** (or "People API") and click **Enable**.

### 2.3 Configure OAuth consent screen
1. **APIs & Services → OAuth consent screen**.
2. Choose **External** → **Create**.
3. Fill in:
   - App name: `FolketsTips`
   - User support email: your email
   - Developer contact email: your email
4. Click **Save and Continue** through the remaining screens.
5. On the **Test users** screen, add your Google account so you can log in during development.
6. Submit for review only when you're ready to go public (not required for testing).

### 2.4 Create OAuth credentials
1. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**.
2. Application type: **Web application**.
3. Name: `FolketsTips Web`.
4. Under **Authorized redirect URIs**, add:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production (add after Vercel deploy): `https://your-app.vercel.app/api/auth/callback/google`
5. Click **Create**.
6. Copy the **Client ID** and **Client Secret** — you'll need them next.

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

---

## Step 3 — NextAuth Secret

NextAuth requires a secret for signing JWTs. Generate one:

```bash
openssl rand -base64 32
```

Copy the output. This becomes:

```
AUTH_SECRET=your-generated-secret
```

---

## Step 4 — Local development setup

### 4.1 Install dependencies
```bash
npm install
```

### 4.2 Create your local environment file
Create a file called `.env.local` in the project root (never commit this):

```env
# Database
POSTGRES_PRISMA_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require&pgbouncer=true&connect_timeout=15
POSTGRES_URL_NON_POOLING=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require

# NextAuth
AUTH_SECRET=your-generated-secret
AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 4.3 Run database migrations
This creates all the tables in your Neon database:

```bash
npx prisma migrate deploy
```

Or if you want to apply migrations and generate the Prisma client in one step:

```bash
npx prisma generate
npx prisma migrate deploy
```

### 4.4 Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the landing page.

---

## Step 5 — Deploy to Vercel

### 5.1 Import the project
1. Go to [vercel.com](https://vercel.com) and log in (GitHub login recommended).
2. Click **Add New → Project**.
3. Find and import your `FolketsTips` GitHub repository.
4. Framework preset will auto-detect as **Next.js** — leave all build settings as default.
5. **Do not click Deploy yet** — add environment variables first.

### 5.2 Add environment variables in Vercel
In the **Environment Variables** section before deploying:

| Name | Value |
|---|---|
| `POSTGRES_PRISMA_URL` | Pooled Neon connection string |
| `POSTGRES_URL_NON_POOLING` | Direct Neon connection string |
| `AUTH_SECRET` | Your generated secret |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |

> `AUTH_URL` does **not** need to be set on Vercel — NextAuth detects the URL automatically.

### 5.3 Deploy
Click **Deploy**. Vercel will build and deploy the app. This usually takes 1–2 minutes.

### 5.4 Add your production URL to Google OAuth
After deployment, copy your Vercel URL (e.g. `https://folkets-tips.vercel.app`):

1. Go back to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Click your OAuth 2.0 client.
3. Under **Authorized redirect URIs**, add:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```
4. Save.

### 5.5 Run migrations on the production database
Your Neon database already has the schema from local development — no extra step needed unless you skipped Step 4.3. If you skipped it, run it now:

```bash
POSTGRES_URL_NON_POOLING="your-direct-connection-string" npx prisma migrate deploy
```

---

## Step 6 — Verify everything works

1. Visit your Vercel URL.
2. Click **Sign in with Google** — you should be redirected to Google and back.
3. Try creating a room.
4. Open the room link in another browser tab (no login needed) and submit tips.
5. Back in the dashboard, click **Generate result**.

---

## Custom domain (optional)

1. In Vercel, go to your project → **Settings → Domains**.
2. Add your domain and follow the DNS instructions.
3. After the domain is active, add it to Google OAuth authorized redirect URIs:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```

---

## Environment variable reference

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_PRISMA_URL` | Yes | Pooled PostgreSQL connection (with `pgbouncer=true`) |
| `POSTGRES_URL_NON_POOLING` | Yes | Direct PostgreSQL connection (for migrations) |
| `AUTH_SECRET` | Yes | Random secret for NextAuth JWT signing |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth 2.0 client secret |
| `AUTH_URL` | Local only | Base URL — only needed in `.env.local` for dev |

---

## Troubleshooting

**"Invalid redirect_uri" on Google login**
→ Make sure your Vercel URL is listed under Authorized Redirect URIs in Google Cloud Console with the exact path `/api/auth/callback/google`.

**Database connection errors on Vercel**
→ Verify `POSTGRES_PRISMA_URL` ends with `&pgbouncer=true&connect_timeout=15`. Vercel is serverless and requires pooled connections.

**Migrations not applied**
→ Run `npx prisma migrate deploy` locally pointing at your Neon database, or use the Neon SQL editor to inspect your tables.

**Build fails on Vercel**
→ Check that all five environment variables are set in Vercel project settings. Missing `AUTH_SECRET` is the most common cause.
