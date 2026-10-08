# Job Board - Task 2: Authentication with bcrypt and JWT

Builds on Task 1 and adds user signup and login. Passwords are hashed with bcrypt, logins return a JWT, and protected routes require a valid token.

**Stack:** Node.js, Express, MongoDB with Mongoose, JWT, bcrypt; React (Vite) frontend.

## Features

- Signup with validation and duplicate email detection (409)
- Passwords hashed with bcrypt (12 salt rounds) and never returned by the API
- Login returns a signed JWT; wrong credentials return 401
- auth middleware protects routes: GET /api/auth/profile and all job create, update and delete routes
- React pages for signup, login and profile, protected routes and a saved session

## Project structure

```
server/
  server.js
  src/
    app.js
    config/db.js
    controllers/ (authController, jobController)
    middleware/ (auth, errorHandler)
    models/ (User, Job)
    routes/ (authRoutes, jobRoutes)
    utils/ (AppError, asyncHandler, generateToken, pick)
client/            React app (Vite)
  src/ pages/, components/, context/AuthContext.jsx, api.js
```

## Prerequisites

- Node.js 18 or newer
- MongoDB running locally, or a free MongoDB Atlas connection string

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # then edit .env
npm run dev
```

The API runs on http://localhost:5000.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The app runs on http://localhost:5173. Vite proxies /api requests to the backend, so start the backend first.

## Environment variables (server/.env)

| Variable | Purpose |
|----------|---------|
| PORT | Server port (default 5000) |
| MONGO_URI | MongoDB connection string |
| JWT_SECRET | Long random string used to sign tokens |
| JWT_EXPIRES_IN | Token lifetime, for example 7d |

## API endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a user and receive a JWT |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/auth/profile` | Logged in | Get the current user profile |
| GET | `/api/jobs` | Public | List all jobs |
| GET | `/api/jobs/:id` | Public | Get one job |
| POST | `/api/jobs` | Logged in | Create a job |
| PUT | `/api/jobs/:id` | Logged in | Update a job |
| DELETE | `/api/jobs/:id` | Logged in | Delete a job |

Send the token on protected routes: `Authorization: Bearer <token>`.

### Job fields

`title` (3-100 characters), `company`, `location`, `type` (Full-time, Part-time, Contract, Internship or Remote), `salary` (number, 0 or more), `description` (at least 10 characters).

### Response format

Success: `{ "success": true, "data": ... }`. Error: `{ "success": false, "message": "..." }`.

### Status codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error or invalid input |
| 401 | Missing, invalid or expired token, or wrong credentials |
| 403 | Authenticated but not allowed (wrong role or not the owner) |
| 404 | Resource or route not found |
| 409 | Conflict (duplicate email or duplicate application) |
| 429 | Too many requests (rate limit) |
| 500 | Server error |

## Testing with Postman

Import `docs/Job-Board-API.postman_collection.json`. Set the collection variable `baseUrl` if your server uses another address. The Signup and Login requests save the token automatically. The Create Job request saves `jobId` automatically.

## Scripts

| Location | Command | Purpose |
|----------|---------|---------|
| server | `npm run dev` | Start the API with auto-reload |
| server | `npm start` | Start the API |
| client | `npm run dev` | Start the React dev server |
| client | `npm run build` | Production build |
