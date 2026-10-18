# Addis Eats

**An Ethiopian Food Ordering Application**

Addis Eats is a responsive web application for exploring Ethiopian dishes, managing a shopping cart, and placing delivery orders. It also includes role-based access for authorized administrative.


## Features

- Browse the food menu and view individual dishes.
- Search and explore available food items.
- Add dishes to the cart and manage quantities.
- Save and manage favorite dishes.
- Select a delivery neighbourhood during checkout.
- Submit orders and view order-related pages.
- Apply role-based access rules for customers and staff.
- Provide administrative pages and order analytics where authorized.
- Use responsive layouts and accessible form controls.

## Technology Stack

- **Framework:** Next.js with the App Router
- **UI:** React and CSS
- **Language:** JavaScript
- **Image handling:** Next.js Image
- **Charts:** Recharts, where used by the dashboard
- **Icons:** Lucide React, where used by the interface
- **Deployment:** Vercel
- **Version control:** Git and GitHub

## Getting Started

### Requirements

- Node.js compatible with the project's installed Next.js version
- npm
- Git

### 1. Clone the repository

Clone the project repository, then navigate to the Day 48 project directory.


### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env.local` file in the project root:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Use `.env.example` as the reference for required variables. Never commit `.env.local` or place private credentials in variables prefixed with `NEXT_PUBLIC_`.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run the production build

```bash
npm run build
```

If the build succeeds, test the production server locally:

```bash
npm run start
```

Open the local URL and check the main customer, checkout, order, and authorized admin or staff workflows.

## Project Structure

```text
addis-eats/
├── app/
│   ├── api/
│   │   └── orders/
│   ├── checkout/
│   ├── menu/
│   └── ...
├── components/
├── lib/
│   ├── dishes.js
│   ├── neighbourhoods.js
│   ├── orders.js
│   └── session.js
├── public/
├── stores/
├── .env.example
├── .gitignore
├── AGENTS.md
├── AUTH.md
├── CLAUDE.md
├── DATA.md
├── PERF.md
├── package.json
└── README.md
```

This is an overview, not an exhaustive listing of every route or file.

## Order Validation and Security

The order API validates the user's session, role, selected delivery neighbourhood, dish IDs, and quantities on the server. Prices should be taken from trusted server-side dish data rather than accepted from the browser.

Authentication and authorization details are documented in `AUTH.md`. Data handling and storage notes are documented in `DATA.md`.

## Environment Variables

| Variable | Purpose | Example |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public website URL used by the application | `http://localhost:3000` |

Set the production value in the Vercel project's environment-variable settings. Add any additional variables if the source code requires them.

## Deployment

1. Commit and push the project to GitHub.
2. Import the repository into Vercel.
3. Set the correct project root directory for this app.
4. Configure the required environment variables.
5. Deploy the application.
6. Open the production URL and test the important user journeys.
7. Run Lighthouse against the deployed website and record the actual results in `PERF.md`.

For this project, the Vercel root directory should point to the directory containing the Day 48 app's `package.json`, not an unrelated project or the repository root.

## Documentation

- `AGENTS.md` — project instructions for coding agents
- `CLAUDE.md` — Claude Code instructions
- `AUTH.md` — authentication and authorization
- `DATA.md` — data validation and storage
- `PERF.md` — measured performance results and optimizations

## Project Status

This project is being developed as part of the IBT-QIYAS / IBT College Canada CodeOps Full-Stack Software Development Program. Verify the production URL, build status, and implemented features before describing the project as production-ready.
