# Estatly — Buyer Portal

A full-stack Next.js real-estate buyer portal with auth, JWT sessions, and a property favourites system.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 (App Router) | Full-stack in one repo, server + client components |
| Auth | JWT in HttpOnly cookies | Stateless, XSS-resistant, 7-day expiry |
| Passwords | bcrypt (cost 12) | Industry-standard hashing |
| DB | JSON file store (`data/`) | Zero-dependency, easy to inspect; swap for Postgres via the same `lib/db.ts` interface |
| Styling | Inline styles + Tailwind utilities | Fine-grained control for custom design |

## Project Structure

```
buyer-portal/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts   # POST — create account
│   │   │   ├── login/route.ts      # POST — sign in
│   │   │   └── me/route.ts         # GET current user | DELETE logout
│   │   └── favourites/
│   │       ├── route.ts            # GET list | POST add
│   │       └── [propertyId]/route.ts # DELETE remove
│   ├── login/page.tsx              # Login + register tabs
│   ├── dashboard/page.tsx          # Property grid + favourites
│   └── page.tsx                    # Root redirect
├── components/
│   ├── AuthProvider.tsx            # Global auth context
│   ├── PropertyCard.tsx            # Card with heart-toggle
│   └── Toast.tsx                   # Toast notifications
├── lib/
│   ├── auth.ts                     # JWT sign / verify helpers
│   ├── db.ts                       # File-based DB + property catalogue
│   └── validation.ts               # Server-side input validation
└── data/                           # Created at runtime
    ├── users.json
    └── favourites.json
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. (Optional) Set a custom JWT secret

```bash
# .env.local
JWT_SECRET=your-super-secret-key-change-in-production
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## Example Flows

### Flow 1: Sign up → Add favourites

1. Visit `http://localhost:3000` → redirected to `/login`
2. Click **Register** tab
3. Fill in: Name `Arjun Mehta`, Email `arjun@example.com`, Password `secure123`
4. Click **Create Account** → redirected to `/dashboard`
5. Browse the 6 listed Mumbai properties
6. Click the **♥ heart button** on any card → toast confirms "Added to favourites"
7. Click the **My Favourites** tab to see your shortlist

### Flow 2: Login with existing account

1. Visit `/login`
2. Enter your email and password
3. Click **Sign In** → dashboard loads with your saved favourites intact

### Flow 3: Remove a favourite

1. On the dashboard, switch to **My Favourites**
2. Click the gold heart on any saved property
3. Property is removed; toast confirms "Removed from favourites"

### Flow 4: Auth protection

- Visiting `/dashboard` without a valid cookie redirects to `/login`
- The `/api/favourites` endpoint returns `401` without a valid JWT
- Users can only view and modify **their own** favourites (enforced server-side)

---

## API Reference

| Method | Path | Auth | Body | Description |
|--------|------|------|------|-------------|
| POST | `/api/auth/register` | No | `{name, email, password}` | Create account |
| POST | `/api/auth/login` | No | `{email, password}` | Sign in, sets cookie |
| GET | `/api/auth/me` | Yes | — | Get current user |
| DELETE | `/api/auth/me` | Yes | — | Logout (clears cookie) |
| GET | `/api/favourites` | Yes | — | List all properties with `isFavourite` flag |
| POST | `/api/favourites` | Yes | `{propertyId}` | Add to favourites |
| DELETE | `/api/favourites/:propertyId` | Yes | — | Remove from favourites |

## Security Notes

- Passwords are **never stored in plain text** — bcrypt with cost factor 12
- JWT is stored in an **HttpOnly cookie** (not localStorage) — immune to XSS
- Login errors use **generic messages** to prevent user enumeration
- All `/api/favourites` routes verify the JWT and enforce **per-user ownership**
- Input is validated server-side before any DB operation

## Production Checklist

- [ ] Set `JWT_SECRET` to a strong random value in env
- [ ] Replace the JSON file DB with a real database (PostgreSQL / SQLite via Prisma)
- [ ] Add rate limiting to auth endpoints
- [ ] Enable HTTPS (cookie `secure: true` is already conditional on `NODE_ENV === "production"`)
