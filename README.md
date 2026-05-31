# 🍽️ EBT Restaurant — EM BABU THINNARA

## Project Structure

```
ebt-restaurant/
├── frontend/       ← React + Vite website
├── backend/        ← Node.js + Express API server
└── package.json    ← Root scripts
```

---

## 🚀 How to Run

### Step 1 — Start the Backend (Terminal 1)
```bash
cd backend
node index.js
```
Runs on: **http://localhost:3001**

### Step 2 — Start the Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Runs on: **http://localhost:5173**

---

## 🔐 Admin Panel

URL: **http://localhost:5173/admin**

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `ebt@2024` |

> The admin link is **not shown** anywhere on the public website. Access it directly via the URL.

---

## 📦 First Time Setup

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🛠️ Admin Features

| Section   | What you can do                            |
|-----------|--------------------------------------------|
| Dashboard | Overview of all data                       |
| Menu      | Add / Edit / Delete categories & dishes    |
| Specials  | Manage chef's special dishes               |
| Branches  | Add / Edit / Delete restaurant branches    |
| Stats     | Update homepage stats (50K+, 3+, etc.)     |
| Franchise | Edit founder info & financial details      |

---

## 📡 API Endpoints

All data is stored in `backend/data/db.json`

| Method | Endpoint              | Auth     | Description          |
|--------|-----------------------|----------|----------------------|
| POST   | /api/auth/login       | ❌ Public | Login → get JWT      |
| GET    | /api/auth/verify      | ❌ Public | Verify JWT token     |
| GET    | /api/menu             | ❌ Public | All menu categories  |
| GET    | /api/branches         | ❌ Public | All branches         |
| GET    | /api/stats            | ❌ Public | Homepage stats       |
| GET    | /api/specials         | ❌ Public | Special dishes       |
| GET    | /api/franchise        | ❌ Public | Franchise info       |
| *      | /api/admin/*          | ✅ JWT   | All write operations |
