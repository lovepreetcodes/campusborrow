# CampusBorrow
https://campusburrow-1.onrender.com/
# CampusBorrow (UniShare)

A full-stack campus exchange platform where students can post, browse, search, and filter items to **borrow**, **give away**, **request**, or **sell**, backed by JWT authentication, guest contact privacy, and owner-controlled item deletion.

---

## Features

### Existing & Core Capabilities
* **Item Feed & Filtering:** Browse campus listings in a 5-column responsive dark UI grid (`slate-950` & `slate-900` surfaces).
* **Type Filter Pills & Live Search:** Filter listings by category (`all`, `borrow`, `giveaway`, `request`, `sell`) and search across item titles and descriptions in real time.
* **Item Creation & Image Fallback:** Post new listings with title, category type, description, contact details, and an optional image URL (with an automatic fallback image if omitted or broken).
* **Report Feedback:** Submit reports through the report form and receive a temporary `"Thanks for reporting"` confirmation banner.

### New & Recent Updates
* **JWT Authentication:** Full sign-up and login flow using `bcryptjs` for password hashing and `jsonwebtoken` (`JWT_SECRET`) for session tokens, with persistent local storage (`cb_token` / `cb_user`) and automatic handling of expired/invalid (`401`) tokens.
* **Guest Contact Privacy:** Unauthenticated visitors can browse listings freely, while `GET /api/items` strips `contact` and `phone` fields when no valid bearer token is present. Cards display a **Login to view contact** prompt for guests and reveal the contact value with a one-click **Copy** button once signed in.
* **Sell Category:** Added `'sell'` to the `Item` schema enum, filter pills, post form dropdown, and card badge styling.
* **Owner-Based Deletion & Simplified Lifecycle:** Replaced legacy `deleteKey` ownership checks with `owner` references tied to the authenticated user. Only the item owner sees and can use the **Delete** action, and the legacy `Claim` status-toggle workflow has been removed in favor of manual owner deletion.
* **Auto-Populated Poster Info:** Item creation automatically resolves `posterName` from the authenticated user's profile and falls back cleanly when `phone`/`contact` is supplied.
* **Modular Frontend & Cleaner Navbar:** Organized UI code into dedicated components (`Navbar`, `AuthModal`, `PostItemForm`, `ReportForm`, `ItemCard`) with grouped action controls (`+ Post Item`, `Report`), a divider, and separated account controls (`user.name`, `Logout` / `Login`).

---

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js, Mongoose (`bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`)
* **Database:** MongoDB
* **Deployment:** Render (Backend), Vercel (Frontend)

---

## Project Structure

```text
CampusBorrow/
├── campusborrow-backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Item.js
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
└── campusborrow-frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AuthModal.jsx
    │   │   ├── ItemCard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PostItemForm.jsx
    │   │   └── ReportForm.jsx
    │   ├── App.jsx
    │   ├── auth.js
    │   └── imageHelper.js
    └── package.json
```
Environment Variables
Backend (campusborrow-backend/.env)
Code snippet
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
Frontend (campusborrow-frontend/.env)
Code snippet
VITE_API_URL=http://localhost:5000
(In production on Vercel, set VITE_API_URL to your live Render backend URL without a trailing slash.)

Local Setup & Running
1. Start the Backend
Bash
cd campusborrow-backend
npm install
npm run dev
(Or npm start depending on your package.json scripts.)

2. Start the Frontend
Bash
cd campusborrow-frontend
npm install
npm run dev
Open the local Vite URL shown in your terminal (typically http://localhost:5173).
