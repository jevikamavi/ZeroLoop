# ZeroLoop — Completing the loop with sustainability

A full-stack **M**ongoDB / **E**xpress / **R**eact / **N**ode rebuild of the
ZeroLoop waste-management web app, localized for a Delhi resident (Jevika
Mavi), with a proper multi-file project structure, a REST API, a persistent
database, light/dark mode, a sorting-assistant chatbot, and community
features (Eco Marketplace, Green Services) — ready to run locally and
deploy for free.

```
zeroloop/
├── client/            React app (Vite)
│   ├── public/
│   │   └── logo.png          your ZeroLoop logo (also used as favicon)
│   └── src/
│       ├── api/                fetch wrapper — the ONLY place that talks to the backend
│       ├── components/         Sidebar, Topbar, Ticket, ToastStack, ChatWidget, icons
│       ├── context/             AuthContext (login session) + AppContext (account/theme/notifications)
│       ├── data/                 local fallback/mock data (used only if the API is unreachable)
│       ├── pages/                 Login, Dashboard, Schedule, Track (Green spots), RecyclingGuide,
│       │                          Rewards, Marketplace, GreenServices, Report, Account, About
│       ├── utils/                 small helpers (authStorage — where the login token is kept)
│       └── styles/               global CSS design system (light + dark theme variables)
├── server/            Node + Express + MongoDB API
│   ├── config/db.js         Mongoose connection (with a DNS override that works
│   │                        around networks/security software that block Atlas's
│   │                        SRV lookups, e.g. HP Wolf Security)
│   ├── models/               User, Account, Pickup, RecurringSchedule, Report,
│   │                          RecyclingItem, MarketplaceItem, GreenService
│   ├── middleware/auth.js    JWT verification — protects the personal-data routes
│   ├── controllers/          business logic for each resource, incl. authController.js, chatController.js
│   ├── routes/                Express routers, mounted under /api/*
│   ├── seed.js                populates MongoDB with starter data + a demo login
│   └── server.js              app entry point
└── package.json        root convenience scripts (run client + server together)
```

## What changed from the original prototype

- **Simple login & sign-up** — every resident now has their own account, protected by a hashed password (`bcrypt`) and a login session (`JWT`). Pickups, reports, recurring schedules, and points are all private to the person who's logged in. See "Local setup" below for the demo login.
- **Green spots near you** — the old "Track truck" page is now a location-aware map of nearby parks and green spaces (using the device's own location + a Google Maps embed), with a compact preview also shown right on the Dashboard next to your next pickup.
- **Real "Recent activity"** — the Dashboard's activity feed is now generated from things you've actually done (reports filed, extra pickups requested, rewards redeemed) instead of sample data.
- **About page** — click the ZeroLoop logo/name at the top of the sidebar to read about the impact the service is trying to have and how.
- **Branding** — renamed to **ZeroLoop**, your uploaded logo is now used in the sidebar and as the browser favicon, tagline "Completing the loop with sustainability," and the accent color is teal `#00A695` instead of amber/yellow.
- **Localization** — units in kg/tonnes instead of lbs/tons, currency in ₹ with Indian digit grouping (e.g. `1,24,000`), dates in `en-IN` format, addresses and route/stop names set in Delhi (Hauz Khas, Lajpat Nagar, Safdarjung Enclave, Green Park, an MCD transfer station), ticket IDs prefixed `ZL-`.
- **Light/dark mode** — a toggle in the top bar switches themes and remembers the choice (`localStorage`), defaulting to the visitor's OS preference on first visit.
- **Working address management** — "Add a new address" and "Set as primary" on the Account page are fully wired up, front to back (this also fixes a bug where the "add address" route was missing entirely on the server).
- **Working notification & account menus** — the bell and avatar in the top bar open real dropdowns, and "Sign out" now actually ends your session.
- **Eco Marketplace** (`/marketplace`) — residents browse and list compost, upcycled goods, plants, and repair services, priced in ₹, EcoPoints, or free.
- **Green Services** (`/green-services`) — a curated directory of sustainability services (solar consultations, authorised e-waste pickup, composting workshops, rainwater harvesting, EV charging, tree plantation drives).
- **Sorting assistant chatbot** — a floating chat widget (bottom-left). Item questions ("what do I do with a can?") are answered instantly by matching against the Recycling Guide dataset; anything else is routed to a Hugging Face model if you set `HUGGINGFACE_API_KEY`, otherwise it gives a helpful fallback reply.
- **DIY reuse links** — `RecyclingItem` now has `diyVideoUrl`/`diyProductUrl` fields. They're empty in the seed data (no fake links included) but the Recycling Guide already renders "Watch DIY idea" / "Shop related product" buttons whenever you fill them in.

> **Two pre-existing bugs fixed along the way:** the server used to crash on startup because a route pointed at a controller function (`getLiveTruckPosition`) that didn't exist — this is why the app always ran on local mock data before now. Separately, the "Add a new address" button on the Account page called an API route that was never registered, so new addresses silently never saved. Both are fixed.

> **Note on the Figma prototype:** I still don't have visibility into the actual Figma frames (the file is behind a login), so I can't guarantee every original screen is represented here. Eco Marketplace and Green Services are built out based on what you named. If there are other specific screens/features from the prototype, list them or export a few screenshots and I'll build those precisely instead of guessing.

## Tech stack & concepts used

- **MongoDB** via **Mongoose** — schemas/models, `findOneAndUpdate` upserts, querying with `$regex`
- **Express** — REST routes, controllers, middleware (`cors`, `express.json`, a custom JWT `requireAuth` guard), environment config via `dotenv`, an external API integration (Hugging Face Inference API)
- **Auth** — password hashing with `bcryptjs`, sessions via `jsonwebtoken` (JWT), stored client-side and sent as a `Bearer` token
- **React** — function components, hooks (`useState`, `useEffect`, `useContext`, `useRef`, `useMemo`, `useCallback`), Context API for shared state (auth session + app data), controlled forms
- **React Router** — client-side routing/navigation (`BrowserRouter`, `Routes`, `NavLink`, `useNavigate`)
- **Vite** — dev server + production build for the client
- **Node.js** — the Express server itself, plus a standalone seed script

## 1. Local setup

**Prerequisites:** Node.js 18+, a MongoDB connection string (a free [MongoDB
Atlas](https://www.mongodb.com/cloud/atlas/register) cluster works great — see
the deployment section below).

```bash
# from the zeroloop/ folder
npm run install:all          # installs server + client dependencies

# configure environment variables
cp server/.env.example server/.env    # then edit MONGODB_URI (and optionally HUGGINGFACE_API_KEY)
cp client/.env.example client/.env    # defaults to http://localhost:5000/api, fine for local dev

# populate the database with starter data (recycling guide, sample pickups, marketplace listings, green services, etc.)
npm run seed

# run both client and server together
npm run dev
```

- API: `http://localhost:5000/api` (health check at `/api/health`)
- App: `http://localhost:5173`

The seed script also creates a **demo login** so you can try the app right away:

```
email:    demo@zeroloop.app
password: zeroloop123
```

Or click "Create account" on the login screen to sign up as yourself instead.
Make sure `server/.env` has a `JWT_SECRET` set (any long random string — the
repo ships with one already generated, but change it before deploying for
real).

You can also run them separately with `npm run dev:server` / `npm run dev:client`.

### Trouble connecting to MongoDB?

If you see `querySrv ECONNREFUSED` or `MONGODB_URI is missing`, see the
comments in `server/config/db.js` — it already forces Node to use public DNS
resolvers (works around networks/security software, e.g. HP Wolf Security,
that block Atlas's SRV DNS lookups), and gives a clear message if `.env`
isn't set up yet.

### Enabling the chatbot's open-ended answers

By default the sorting assistant answers item questions instantly from the
Recycling Guide dataset (no API key needed). For anything else, it uses a
friendly fallback message unless you set these in `server/.env`:

```
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxxxxxxxxxx
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.3
```

Get a free token at <https://huggingface.co/settings/tokens>. Any hosted
instruct-style model on the Inference API will work — just change
`HUGGINGFACE_MODEL`.

## 2. API reference

| Method | Endpoint                              | Purpose                                  | Auth required |
|--------|-----------------------------------------|--------------------------------------------|:---:|
| POST   | `/api/auth/register`                   | Create an account (name, email, password)  | – |
| POST   | `/api/auth/login`                      | Log in, returns a token                    | – |
| GET    | `/api/auth/me`                         | Confirm a saved token is still valid       | ✅ |
| GET    | `/api/pickups/upcoming`                | List upcoming pickups                      | ✅ |
| POST   | `/api/pickups/extra`                   | Request a one-off pickup                   | ✅ |
| GET    | `/api/pickups/recurring`               | Get recurring schedule                     | ✅ |
| PUT    | `/api/pickups/recurring`               | Save recurring schedule                    | ✅ |
| GET    | `/api/recycling?q=&category=`          | Search the recycling sorting guide         | – |
| GET    | `/api/reports`                         | List your submitted issue reports          | ✅ |
| POST   | `/api/reports`                         | Submit an issue report                     | ✅ |
| GET    | `/api/rewards`                         | Reward catalog + your points balance       | ✅ |
| POST   | `/api/rewards/redeem`                  | Redeem a reward                            | ✅ |
| GET    | `/api/marketplace?category=`           | List Eco Marketplace listings              | – |
| POST   | `/api/marketplace`                     | Publish a new marketplace listing          | – |
| GET    | `/api/green-services?category=`        | List curated Green Services                | – |
| POST   | `/api/chat`                            | Ask the sorting assistant a question       | – |
| GET    | `/api/account`                         | Get your account/profile                   | ✅ |
| PUT    | `/api/account`                         | Update profile fields                      | ✅ |
| PUT    | `/api/account/notifications`           | Update notification preferences            | ✅ |
| POST   | `/api/account/addresses`               | Add a saved address                        | ✅ |
| PUT    | `/api/account/addresses/:id/primary`   | Set an address as primary                  | ✅ |
| GET    | `/api/account/activity`                | Recent activity (reports, pickups, redemptions), merged and sorted | ✅ |

Routes marked **Auth required** expect an `Authorization: Bearer <token>`
header — `client/src/api/client.js` attaches this automatically once you're
logged in. "Green spots near you" doesn't have a backend endpoint at all —
it's just the browser's own geolocation plus a Google Maps embed.

Every frontend call goes through `client/src/api/client.js`. If a request
fails (e.g. backend not deployed yet), the calling page falls back to local
mock data from `client/src/data/mockData.js` so the UI never breaks.

## 3. Deploying it for real

### Step 1 — MongoDB Atlas (free database)
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register).
2. Under **Database Access**, create a user + password.
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) for simplicity, or your host's IPs.
4. Click **Connect → Drivers**, copy the connection string, and drop it into `MONGODB_URI`.

### Step 2 — Backend (Render, free tier)
1. Push this repo to GitHub.
2. In [Render](https://render.com), create a **New Web Service** from the repo.
3. Set **Root Directory** to `server`.
4. Build command: `npm install` — Start command: `npm start`.
5. Add environment variables: `MONGODB_URI`, `CLIENT_ORIGIN` (your Vercel URL once you have it), and optionally `HUGGINGFACE_API_KEY` / `HUGGINGFACE_MODEL`.
6. Deploy, then run the seed script once via Render's shell (or run it locally against the Atlas URI): `npm run seed`.

*(Railway or Fly.io work the same way if you prefer them.)*

### Step 3 — Frontend (Vercel, free tier)
1. In [Vercel](https://vercel.com), import the same repo.
2. Set **Root Directory** to `client`.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Add environment variable `VITE_API_URL` = `https://<your-render-app>.onrender.com/api`.
5. Deploy. Once live, copy the Vercel URL into the backend's `CLIENT_ORIGIN` env var on Render and redeploy the backend so CORS allows it.

*(Netlify works identically if you prefer it over Vercel.)*

## 4. Extending it

- **Auth polish** — login is deliberately simple right now (no password reset, no email verification). If you want those, add a `PasswordResetToken` model + an email provider (e.g. Resend or SendGrid) for reset links, and a `verified` flag on `User` for email verification.
- **Real-time green spots** — "Green spots near you" currently uses a Google Maps *search* embed, which is simple but read-only. For a richer map (custom pins, distances, filters), swap it for the Google Maps JavaScript API or a service like Mapbox/OpenStreetMap + Overpass API for real park/garden data.
- **Payments** — the "Manage billing" button is a stub; wire it to Razorpay or a similar India-first payments provider.
- **Photo uploads** — the report form's file input is currently cosmetic; add `multer` + S3/Cloudinary storage on the server to accept real uploads.
- **Marketplace payments/messaging** — "Contact seller" is currently a toast; a real version would need an in-app chat or masked-phone-number reveal, plus a way to mark listings as sold.
- **DIY links** — add real `diyVideoUrl`/`diyProductUrl` values to `RecyclingItem` documents (via `seed.js` or a future admin UI) to light up the "Watch DIY idea" / "Shop related product" buttons on the Recycling Guide.
- **Chatbot memory** — the assistant currently only sends the last few messages as context; for longer conversations, consider a proper conversation-history store per session.
