# Deployment Guide for GrocerX on Vercel (Free Tier)

## Overview
This guide walks you through turning the **local GrocerX monorepo** into a live application hosted on Vercel for free. It covers everything from building the NestJS backend, committing the right files, connecting to a Git‑host, configuring Vercel, and finally testing the deployment.

---

## 1️⃣ Prerequisites
- **Git** installed on your machine (`git --version`).
- A **GitHub** (or GitLab/Bitbucket) account.
- **Vercel** account (free tier).
- **Node.js 20+** (same major version you used locally).
- The repository is located at: `c:\Users\zeesh\.gemini\antigravity\scratch\grocerx`.

---

## 2️⃣ Build the Backend (NestJS) locally
```bash
cd c:\Users\zeesh\.gemini\antigravity\scratch\grocerx\backend
npm install            # install NestJS deps
npm run build          # compiles to ./dist
```
- Verify that `backend/dist` now contains compiled JavaScript files (e.g., `dist/src/main.js`).
- **Important:** Vercel will serve the compiled files, so they **must be committed**.

---

## 3️⃣ Ensure `backend/dist` is **not** ignored by Git
Open the repo’s `.gitignore` (located at the root). If you see a line like `backend/dist` or `dist/` that would ignore the compiled output, **remove or comment it out**:
```gitignore
# backend/dist   <-- comment or delete this line
```
Commit the change:
```bash
git add .gitignore
git commit -m "Allow backend/dist to be versioned for Vercel"   # optional but recommended
```

---

## 4️⃣ Add the Vercel helper files (already present)
- `vercel.json` – tells Vercel how to build the front‑end and where the API lives.
- `api/index.js` – serverless wrapper that boots the compiled NestJS app.
- `api/package.json` – minimal deps for the wrapper.

If you need to double‑check, they are located at:
```
grocerx/vercel.json
grocerx/api/index.js
grocerx/api/package.json
```
No further edits are required.

---

## 5️⃣ (Optional) Add a small README for future reference
Create `DEPLOYMENT_GUIDE.md` (this file) if you wish to keep it in the repo. It is already created.

---

## 6️⃣ Initialise a Git repository (if you haven’t yet) and push to GitHub
```bash
cd c:\Users\zeesh\.gemini\antigravity\scratch\grocerx
# If already a repo, skip `git init`
git init
git add .
git commit -m "Initial commit – GrocerX with Vercel config"
# Replace <YOUR-USERNAME> with your GitHub username
git remote add origin https://github.com/<YOUR-USERNAME>/grocerx.git
git branch -M main
git push -u origin main
```
> **Tip:** After the first push Vercel will be able to import the repo.

---

## 7️⃣ Create a Vercel project
1. Log in to **vercel.com**.
2. Click **New Project** → **Import Git Repository**.
3. Select the `grocerx` repository you just pushed.
4. Vercel will detect the `vercel.json` file automatically.
5. Click **Deploy**.

---

## 8️⃣ Set environment variables on Vercel
Navigate to **Project Settings → Environment Variables** and add the following (adjust values for your setup):
| Variable | Scope | Example value |
|----------|-------|---------------|
| `FRONTEND_URL` | Production | `https://<project-name>.vercel.app` |
| `DATABASE_URL` | Production | `file:./database.sqlite` *(or your remote DB URL)* |
| `MAIL_API_KEY` | Production | *your mail provider key* |
| `SECRET_KEY` | Production | *random long string* |
> The same variables should be added under **Preview** if you intend to use preview branches.

---

## 9️⃣ Deploy & verify
- After adding env vars, Vercel will automatically **re‑deploy**.
- When the deployment finishes, open the URL shown in the dashboard.
  - **Front‑end**: `https://<project>.vercel.app/` – you should see the GrocerX UI.
  - **Backend**: try a simple endpoint, e.g. `https://<project>.vercel.app/api/users` (or any route you have). You should receive JSON data.
- If you encounter a **404** on the API, double‑check that `backend/dist` is present in the repo and that the `api/index.js` path (`../backend/dist/src/app.module`) matches the folder structure.

---

## 🔧 Common pitfalls & fixes
| Issue | Why it happens | Fix |
|-------|----------------|-----|
| **`Cannot find module '../backend/dist/src/app.module'`** | The compiled `dist` folder wasn’t committed or the relative path is wrong. | Ensure `backend/dist` exists in the repo and the path `../backend/dist/src/app.module` matches the folder hierarchy.
| **Function size > 50 MB** | Additional dev dependencies were left in `api/node_modules`. | Keep `api/package.json` minimal (as it is) and run `npm prune --production` before committing, or let Vercel install only the declared deps.
| **Request times out (> 10 s)** | Heavy DB queries or image processing inside the lambda. | Off‑load long jobs to a separate worker (e.g., Railway, RailwayDB) or store images in an external bucket.
| **CORS error on the front‑end** | `FRONTEND_URL` env var not set or mismatched. | Set `FRONTEND_URL` to the exact Vercel domain (`https://<project>.vercel.app`).

---

## 📋 Quick checklist (run after each major step)
- [ ] Backend compiled (`npm run build` inside `backend`).
- [ ] `backend/dist` is tracked by Git.
- [ ] `vercel.json`, `api/index.js`, `api/package.json` are present.
- [ ] Repo pushed to GitHub.
- [ ] Vercel project linked and deployed.
- [ ] Env vars added (`FRONTEND_URL`, DB, secrets).
- [ ] Front‑end reachable at Vercel URL.
- [ ] API reachable (`/api/...`).

---

## 🎉 You’re live!
Your GrocerX platform now runs entirely on Vercel’s free tier:
- **Static assets** (React/Vite) served via Vercel CDN.
- **NestJS API** runs as a server‑less function (`api/index.js`).
- No separate server or Docker containers needed.

If you need to update the app, simply push new commits to the `main` branch – Vercel will rebuild automatically.

---

*Feel free to reach out if you hit any hiccups during the deploy!*
