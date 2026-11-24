# 🛠️ CodeQuest 3D — Local Setup & Installation Guide

This guide provides step-by-step instructions for configuring and running **CodeQuest 3D** locally on Windows, macOS, or Linux.

---

## 📑 Table of Contents

- [System Prerequisites](#-system-prerequisites)
- [Repository Cloning](#-repository-cloning)
- [Backend Setup (Django & DRF)](#-backend-setup-django--drf)
  - [1. Virtual Environment Setup](#1-virtual-environment-setup)
  - [2. Dependencies Installation](#2-dependencies-installation)
  - [3. Environment Configuration](#3-environment-configuration)
  - [4. Database Migrations & Seeding](#4-database-migrations--seeding)
  - [5. Run Backend Server](#5-run-backend-server)
- [Frontend Setup (Next.js & React)](#-frontend-setup-nextjs--react)
  - [1. Dependencies Installation](#1-dependencies-installation)
  - [2. Environment Configuration](#2-environment-configuration)
  - [3. Run Frontend Server](#3-run-frontend-server)
- [Database Options (SQLite vs PostgreSQL)](#-database-options-sqlite-vs-postgresql)
- [Demo Account Credentials](#-demo-account-credentials)
- [Troubleshooting & Common Issues](#-troubleshooting--common-issues)

---

## 📋 System Prerequisites

Ensure you have the following installed before starting:

| Tool | Minimum Version | Recommended Version | Download Link |
|---|---|---|---|
| **Node.js** | `v18.18.0` | `v20.x` LTS | [nodejs.org](https://nodejs.org/) |
| **npm** | `v9.0.0` | `v10.x` | Packaged with Node.js |
| **Python** | `3.11.x` | `3.12.x` or `3.13.x` | [python.org](https://www.python.org/) |
| **Git** | `2.x` | Latest | [git-scm.com](https://git-scm.com/) |
| *(Optional)* **PostgreSQL** | `14.x` | `16.x` | [postgresql.org](https://www.postgresql.org/) |

---

## 📥 Repository Cloning

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/shubhamjrd4559-sudo/Codequest-3d.git
cd Codequest-3d
```

---

## 🐍 Backend Setup (Django & DRF)

Open your terminal in the cloned repository.

### 1. Virtual Environment Setup

Navigate to the `backend/` directory and create an isolated Python virtual environment:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment based on your operating system:

- **Windows (PowerShell):**
  ```powershell
  .venv\Scripts\Activate.ps1
  ```
  *(If you encounter a script execution restriction, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` first).*

- **Windows (Command Prompt):**
  ```cmd
  .venv\Scripts\activate.bat
  ```

- **macOS / Linux (Bash/Zsh):**
  ```bash
  source .venv/bin/activate
  ```

Your shell prompt should now display `(.venv)`.

---

### 2. Dependencies Installation

Install the required Python packages into your active virtual environment:

```bash
pip install --upgrade pip
pip install asgiref Django django-cors-headers djangorestframework djangorestframework-simplejwt psycopg2-binary PyJWT python-dotenv sqlparse
```

---

### 3. Environment Configuration

Copy the example environment file to `.env`:

```bash
# Windows (PowerShell / CMD):
copy .env.example .env

# macOS / Linux:
cp .env.example .env
```

Verify the values in `backend/.env`. By default, it is configured for local SQLite development:

```ini
DJANGO_SECRET_KEY=replace-with-a-strong-random-secret
DJANGO_DEBUG=true
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
DJANGO_TIME_ZONE=UTC
DATABASE_ENGINE=sqlite
CORS_ALLOWED_ORIGINS=http://localhost:3000
API_PAGE_SIZE=20
```

---

### 4. Database Migrations & Seeding

Apply Django migrations to initialize your database tables:

```bash
python manage.py migrate
```

Seed the curriculum (Topics, Lessons, Quizzes) and the 200 daily questions:

```bash
# 1. Seed core topics, lessons, quizzes, and games
python fix_and_seed.py

# 2. Seed 200 date-rotated C++ & DSA daily questions
python seed_daily_questions.py
```

*(Optional)* Create an administrative superuser to access Django Admin:

```bash
python manage.py createsuperuser
```

---

### 5. Run Backend Server

Start the Django development server on port 8000:

```bash
python manage.py runserver 8000
```

You should see output similar to:
```text
Django version 6.1.3, using settings 'config.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

- API Base URL: `http://localhost:8000/api/v1/`
- Django Admin: `http://localhost:8000/admin/`

---

## ⚛️ Frontend Setup (Next.js & React)

Open a **second, separate terminal** in the project root:

```bash
cd Codequest-3d/frontend
```

### 1. Dependencies Installation

Install all node dependencies:

```bash
npm install
```

---

### 2. Environment Configuration

The frontend defaults to connecting to `http://localhost:8000/api/v1`. If you need custom endpoints, create a `.env.local` file inside `frontend/`:

```ini
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

### 3. Run Frontend Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be accessible at: **`http://localhost:3000`**

To verify type safety and build viability:
```bash
npx tsc --noEmit
npm run build
```

---

## 🗄️ Database Options (SQLite vs PostgreSQL)

### Development: SQLite (Default)
No additional installation required. The database will be created as `backend/db.sqlite3`.

### Production: PostgreSQL
To use PostgreSQL, update your `backend/.env`:

```ini
DATABASE_ENGINE=postgres
POSTGRES_DB=codequest3d
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

Ensure PostgreSQL is running and the database `codequest3d` exists:
```sql
CREATE DATABASE codequest3d;
```
Then run `python manage.py migrate` and seed scripts as shown above.

---

## 👤 Demo Account Credentials

For quick evaluation and testing without manually registering:

- **Email:** `hero@codequest.dev`
- **Password:** Pre-authenticated via the **"Use Demo Account"** button on the `/login` page.
- **Attributes:** Pre-configured with initial XP, daily quiz streaks, and unlocked achievements.

---

## 🔍 Troubleshooting & Common Issues

### 1. PowerShell Script Execution Error
**Problem:** `Activate.ps1 cannot be loaded because running scripts is disabled on this system.`  
**Solution:** Run the following command in PowerShell:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then re-run `.venv\Scripts\Activate.ps1`.

### 2. CORS Error (`Access-Control-Allow-Origin`)
**Problem:** The frontend console reports cross-origin requests blocked by CORS policy.  
**Solution:** Ensure `CORS_ALLOWED_ORIGINS` in `backend/.env` includes `http://localhost:3000`. Restart the Django server after modifying `.env`.

### 3. Port 8000 or 3000 Already in Use
**Problem:** `Error: That port is already in use.`  
**Solution:**
- On Windows (PowerShell):
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
  ```
- Or run Django on a different port:
  ```bash
  python manage.py runserver 8001
  ```
  *(Update `NEXT_PUBLIC_API_URL=http://localhost:8001/api/v1` in `frontend/.env.local`).*

### 4. Next.js Module / Chunk Build Glitch
**Problem:** `Cannot find module './vendor-chunks/motion-dom.js'`  
**Solution:** Delete the `.next` build cache and restart:
```bash
# Inside frontend directory:
rm -rf .next
npm run dev
```
