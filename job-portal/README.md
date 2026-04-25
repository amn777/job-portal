# 🚀 Job Portal + Referral System

Full-stack job portal with JWT auth, referral system, leaderboard, and admin dashboard.

**Tech Stack:** React · Spring Boot · PostgreSQL · JWT · Spring Mail

---

## 📁 Project Structure

```
job-portal/
├── backend/
│   └── job-portal-backend/     ← Spring Boot project
└── frontend/                   ← React project
```

---

## ⚙️ LOCAL SETUP

### Step 1 — PostgreSQL Database

Open pgAdmin or psql and run:
```sql
CREATE DATABASE jobportal;
```

### Step 2 — Backend Setup

```bash
cd backend/job-portal-backend
```

Open `src/main/resources/application.properties` and update:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobportal
spring.datasource.username=postgres
spring.datasource.password=YOUR_POSTGRES_PASSWORD
```

Run the backend:
```bash
mvn spring-boot:run
```

Backend will start on → **http://localhost:8080**

Tables are created automatically via `spring.jpa.hibernate.ddl-auto=update`

### Step 3 — Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend will start on → **http://localhost:3000**

---

## 🌱 Seed Demo Data (Optional)

After backend starts, run this SQL to add demo users:

```sql
-- Password for all: use the API to register, or insert BCrypt hashes
-- Easiest: register via the UI at http://localhost:3000/register
```

Or register via the app:
- Go to http://localhost:3000/register
- Register as USER, RECRUITER, ADMIN (select role in dropdown)

---

## ☁️ DEPLOYMENT GUIDE

### Step 1 — Neon PostgreSQL (Free DB)

1. Go to https://neon.tech → Sign up with GitHub
2. Create new project → name it `jobportal`
3. Copy the **Connection String** (looks like):
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/jobportal?sslmode=require
   ```
4. Save this — you'll need it for Render

---

### Step 2 — Deploy Backend on Render (Free)

1. Go to https://render.com → Sign up with GitHub
2. Click **New** → **Web Service**
3. Connect your GitHub repo
4. Set these settings:
   - **Name:** `job-portal-backend`
   - **Root Directory:** `backend/job-portal-backend`
   - **Runtime:** Docker (it will use the Dockerfile)
   - **Plan:** Free

5. Add **Environment Variables** in Render dashboard:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon connection string |
| `DB_USERNAME` | Your Neon username |
| `DB_PASSWORD` | Your Neon password |
| `JWT_SECRET` | Any random 64-char string |
| `MAIL_USERNAME` | your-gmail@gmail.com |
| `MAIL_PASSWORD` | Gmail App Password (not your real password) |
| `FRONTEND_URL` | https://your-app.vercel.app (fill after Vercel deploy) |
| `SPRING_PROFILES_ACTIVE` | prod |

6. Click **Create Web Service**
7. Wait ~5 mins for first deploy
8. Copy your Render URL: `https://job-portal-backend.onrender.com`

**Gmail App Password Setup:**
- Go to Google Account → Security → 2-Step Verification → App Passwords
- Create a new app password → copy the 16-char password
- Use that as `MAIL_PASSWORD`

---

### Step 3 — Deploy Frontend on Vercel

1. Go to https://vercel.com → Login with GitHub
2. Click **New Project** → Import your repo
3. Set **Root Directory** to `frontend`
4. Add **Environment Variable**:
   ```
   REACT_APP_API_URL = https://job-portal-backend.onrender.com/api
   ```
5. Click **Deploy**
6. Copy your Vercel URL: `https://your-app.vercel.app`

**Go back to Render** → Update `FRONTEND_URL` env var with your Vercel URL

---

### Step 4 — GitHub Push (connect everything)

```bash
# In the root job-portal folder
git init
git add .
git commit -m "Initial commit: Job Portal + Referral System"
git remote add origin https://github.com/YOUR_USERNAME/job-portal.git
git push -u origin main
```

---

## 🔑 API Endpoints

### Auth
```
POST /api/auth/register   → Register new user
POST /api/auth/login      → Login, get JWT token
```

### Jobs
```
GET    /api/jobs/search          → Search jobs (public)
GET    /api/jobs/{id}            → Job details (public)
GET    /api/jobs                 → All jobs (auth)
POST   /api/jobs                 → Create job (RECRUITER)
PUT    /api/jobs/{id}            → Update job (RECRUITER)
DELETE /api/jobs/{id}            → Delete job (RECRUITER)
GET    /api/jobs/my-jobs         → My jobs (RECRUITER)
```

### Applications
```
POST   /api/applications              → Apply to job (USER)
GET    /api/applications/my           → My applications (USER)
GET    /api/applications/job/{jobId}  → Job applicants (RECRUITER)
PATCH  /api/applications/{id}/status  → Update status (RECRUITER)
```

### Referrals
```
POST /api/referrals          → Send referral
GET  /api/referrals/my       → My referrals
GET  /api/referrals/leaderboard → Leaderboard
```

### Admin
```
GET    /api/admin/stats          → Dashboard stats
GET    /api/admin/users          → All users
DELETE /api/admin/users/{id}     → Delete user
PATCH  /api/admin/jobs/{id}/toggle → Toggle job status
```

---

## ✅ Features Checklist

- [x] JWT Authentication (Login/Register)
- [x] BCrypt password hashing
- [x] Role-based access (USER / RECRUITER / ADMIN)
- [x] Job posting with CRUD
- [x] Job search with filters (keyword, location, type)
- [x] Pagination on all list endpoints
- [x] Apply to jobs with resume URL
- [x] Application status tracking
- [x] Referral system with email notifications
- [x] Referral leaderboard
- [x] Admin dashboard with charts
- [x] Notifications system
- [x] Saved jobs
- [x] Dark mode
- [x] Email notifications (Spring Mail)
- [x] Deployed on Render + Vercel + Neon

---

## 🐛 Common Issues

**Backend won't start:**
- Check PostgreSQL is running on port 5432
- Verify password in application.properties

**CORS error in browser:**
- Add your frontend URL to `cors.allowed-origins` in application.properties

**Email not sending:**
- Use Gmail App Password, not your real Gmail password
- Enable 2FA on Gmail first

**Render free tier slow:**
- Free tier spins down after 15min inactivity
- First request takes ~30 seconds to wake up
- This is normal for free tier

---

Built with ❤️ using Spring Boot + React
