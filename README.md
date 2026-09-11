# Task Board — Software Engineer Intern Technical Assignment
 
A full-stack Trello-style task management application with role-based access control, drag-and-drop status updates, and an admin dashboard for managing users and task assignments.
 
**Live App:** https://task-board-seven-psi.vercel.app
**Backend API:** https://task-board-production-8cde.up.railway.app
 
---

## Table of Contents
 
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [Environment Variables](#environment-variables)
- [Creating an Admin User](#creating-an-admin-user)
- [API Overview](#api-overview)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
---
 
## Overview
 
Task Board is a Kanban-style app where users can create, view, and organize tasks across three columns — **To Do**, **Doing**, and **Done** — using drag-and-drop. It supports two roles:
 
- **Users** can register, log in, create tasks, self-assign any unassigned task, and move their own or assigned tasks between statuses.
- **Admins** (created only via a backend seed script, never through public registration) can view all users, view all tasks, and reassign any task to any user at any time.
All role-based permissions are enforced on the **backend**, not just hidden in the UI — a normal user cannot bypass restrictions by calling the API directly.
 
---
 
## Features
 
- Secure authentication with hashed passwords (bcrypt) and JWT-based sessions
- Role-based access control (`user` / `admin`) enforced via backend middleware
- Task CRUD with creator, assignee, status, and timestamps
- Self-assignment restricted to unassigned tasks; admins can assign/reassign/unassign freely
- Drag-and-drop board with persistent status updates (survives refresh)
- Admin dashboard: searchable user table with per-user task counts, and a searchable/filterable assignment manager
- Toast notifications and confirmation dialogs (SweetAlert2) for all key actions
- Fully responsive layout: collapsible sidebar drawer, swipeable board columns, and card-style tables on mobile
- Separate frontend/backend codebases communicating over a REST API
---
 
## Tech Stack
 
**Frontend**
- React (Vite)
- React Router
- Axios
- `@hello-pangea/dnd` (drag-and-drop)
- `react-hot-toast` (notifications)
- `sweetalert2` (confirmation dialogs)
**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for authentication
- `bcryptjs` for password hashing
- `cors`, `dotenv`
**Deployment**
- Frontend: Vercel
- Backend: Railway
- Database: MongoDB Atlas
---

## Project Structure
 
```
task-board/
├── task-board-backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/       # authController, taskController, userController
│   │   ├── middleware/        # authMiddleware (protect, adminOnly)
│   │   ├── models/            # User.js, Task.js
│   │   ├── routes/            # authRoutes, taskRoutes, userRoutes
│   │   ├── seed/seedAdmin.js  # creates the admin user
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── task-board-frontend/
    ├── src/
    │   ├── api/                # axios instance + endpoint helpers
    │   ├── components/         # Sidebar, Layout, ProfileMenu, TaskCard, Column, etc.
    │   ├── context/AuthContext.jsx
    │   ├── pages/               # Login, Register, Board, AdminUsers, AdminAssignments
    │   └── App.jsx
    ├── .env.example
    └── package.json
```
 
---

## Local Setup
 
### Prerequisites
- Node.js (v18+)
- A MongoDB Atlas account (or local MongoDB instance)
### 1. Clone the repo
```bash
git clone https://github.com/aasimmohamed/task-board.git
cd task-board
```
 
### 2. Backend setup
```bash
cd task-board-backend
npm install
cp .env.example .env   # then fill in real values, see below
npm run dev
```
Backend runs on `http://localhost:5001` (or whatever `PORT` you set).
 
### 3. Frontend setup
```bash
cd task-board-frontend
npm install
cp .env.example .env   # then fill in real values, see below
npm run dev
```
Frontend runs on `http://localhost:5173`.
 
### 4. Seed an admin user (local)
```bash
cd task-board-backend
npm run seed:admin
```
See [Creating an Admin User](#creating-an-admin-user) below for details.
 
---

## Environment Variables
 
### Backend (`task-board-backend/.env`)
 
| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://mhdsha29_db_user:J15cVctbaaGGj11u@task-board-cluster.wi7w6hi.mongodb.net` |
| `JWT_SECRET` | Long random string used to sign JWTs | generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `PORT` | Port the server listens on (optional locally; Railway injects its own in production) | `5001` |
| `ADMIN_EMAIL` | Email used by the seed script to create the admin | `admin@taskboard.com` |
| `ADMIN_PASSWORD` | Password used by the seed script to create the admin | `admin123456` |
| `FRONTEND_URL` | Deployed frontend URL, used for CORS in production | `https://task-board-seven-psi.vercel.app` |
 
An `.env.example` (no real secrets) is included in `task-board-backend/` for reference.
 
### Frontend (`task-board-frontend/.env`)
 
| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5001/api` (local) or `https://task-board-production-8cde.up.railway.app` (production) |
 
An `.env.example` is included in `task-board-frontend/` for reference.
 
**Note:** Neither `.env` file is committed to the repository (see `.gitignore`). All real values are configured directly in Railway's and Vercel's environment variable dashboards for the deployed version.
 
---
 
## Creating an Admin User
 
Admins are **never** created through the public `/register` endpoint — that endpoint always assigns the `user` role, regardless of what's sent in the request body. This prevents anyone from self-elevating to admin.
 
Instead, an admin is created by running a seed script directly against the database:
 
```bash
cd task-board-backend
npm run seed:admin
```
 
This reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`, hashes the password, and inserts a user with `role: "admin"` — or logs that one already exists if it's already been run.
 
Since the local `.env` and the deployed backend point to the same MongoDB Atlas database, running this script locally (once, pointed at the production `MONGO_URI`) is sufficient to create the admin account used in the deployed app — no shell access to the hosting platform is required.
 
---

## API Overview
 
All routes are prefixed with `/api`. Task and user routes require a `Bearer <token>` Authorization header.
 
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new user (always role `user`) |
| POST | `/auth/login` | Public | Log in, returns JWT |
| GET | `/tasks` | Authenticated | List all tasks |
| POST | `/tasks` | Authenticated | Create a task |
| PATCH | `/tasks/:id/status` | Creator, assignee, or admin | Update task status (drag-and-drop) |
| PATCH | `/tasks/:id/assign` | Self (if unassigned) or admin (any user, any time) | Assign / reassign / unassign a task |
| PATCH | `/tasks/:id` | Creator or admin | Edit task title/description |
| DELETE | `/tasks/:id` | Creator or admin | Delete a task |
| GET | `/users` | Admin only | List all users with task counts |
 
---

## Deployment
 
- **Frontend** is deployed on **Vercel**, built from the `task-board-frontend/` directory of this repo (Root Directory set to `task-board-frontend` in project settings).
- **Backend** is deployed on **Railway**, built from the `task-board-backend/` directory of this repo (Root Directory set to `task-board-backend` in service settings).
- **Database** is hosted on **MongoDB Atlas**, shared between the local dev environment and the deployed backend.
- CORS on the backend is restricted to `http://localhost:5173` and the value of `FRONTEND_URL` (the live Vercel URL), so only the deployed frontend and local dev server can call the API.
---

## Screenshots
 
![Login page](./screenshots/login.png)
![Board view](./screenshots/board.png)
![Admin - All Users](./screenshots/admin-users.png)
![Admin - Manage Assignments](./screenshots/admin-assignments.png)
![Mobile view](./screenshots/mobile.png)