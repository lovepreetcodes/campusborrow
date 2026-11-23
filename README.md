# CampusBorrow

**Live demo:** https://campusborrow-frontend.vercel.app/
backend - https://campusburrow-1.onrender.com/

A full-stack campus exchange platform where students can post, browse, search and filter items to **borrow**, **give away**, **request** or **sell**. It uses JWT authentication, hides contact details from guests, and lets only the owner of an item delete it.

---

## Features

* **Item feed and filters:** Browse listings in a responsive grid. Filter by type (`all`, `borrow`, `giveaway`, `request`, `sell`) and search titles and descriptions as you type.
* **Colour-coded type badges:** Each item type has its own colour (borrow, giveaway, request, sell) so the feed is easy to scan.
* **Sign up and login:** Passwords are hashed with `bcryptjs`. The server issues a `jsonwebtoken` token valid for 7 days. The token and user are kept in `localStorage` (`cb_token` / `cb_user`), so you stay logged in after a refresh. Expired or invalid tokens (401) log the user out and reopen the login popup.
* **Guest contact privacy:** Anyone can browse, but `GET /api/items` removes `phone` and `contact` unless a valid bearer token is sent. Guests see **Login to view contact**. Logged-in users see the contact with a one-click **Copy** button.
* **Post items with photos:** Logged-in users post an item with title, type, contact, description and an optional photo. The photo is resized in the browser (max 600px, JPEG) before upload, and a default image is shown when no photo is added.
* **Owner-only deletion:** Each item stores its `owner`. Only the owner sees the **Delete** button, and the server checks ownership again before deleting.
* **Auto-filled poster name:** The poster's name comes from their account, not the form.
* **Report form:** Shows a "Thanks for reporting!" confirmation. Reports are not saved to the database yet (UI only).

---

## Tech Stack

* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Express, Mongoose, `bcryptjs`, `jsonwebtoken`, `dotenv`, `cors`
* **Database:** MongoDB
* **Deployment:** Render (backend), Vercel (frontend)

---

## How It Works

```
React (browser)  <--fetch + JSON-->  Express API  <--Mongoose-->  MongoDB
```

* `App.jsx` holds the shared state (`items`, `selectedType`, `search`, `token`, `user`, and which popup is open) and makes the API calls for loading and deleting items.
* Child components receive data as props and report events back through function props such as `onDelete`, `onLogin` and `onSuccess`.
* The feed reloads whenever the type filter or the token changes. Logging in therefore reloads the items with the token, and the server then includes contact details.
* Protected requests send the header `Authorization: Bearer <token>`.

### API

| Method and URL | Login | Description |
|---|---|---|
| `POST /api/auth/register` | No | Create an account, returns `{ token, user }` |
| `POST /api/auth/login` | No | Log in, returns `{ token, user }` |
| `GET /api/items?type=borrow` | Optional | List items, newest first. Contact details are removed for guests |
| `POST /api/items` | Required | Create an item owned by the logged-in user |
| `DELETE /api/items/:id` | Required | Delete an item. Owner only (403 otherwise) |

---

## Project Structure

```text
CampusBorrow/
├── campusborrow-backend/
│   ├── middleware/
│   │   └── auth.js          # requireLogin and optionalLogin token guards
│   ├── models/
│   │   ├── Item.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js          # register, login
│   │   └── items.js         # list, post, delete items
│   ├── server.js            # setup, MongoDB connection, route mounting
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
    │   ├── auth.js          # token and user helpers (localStorage)
    │   ├── imageHelper.js   # default image and photo resizing
    │   └── main.jsx
    └── package.json
```

---

## Environment Variables

**Backend** (`campusborrow-backend/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
```

**Frontend** (`campusborrow-frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
```

In production, set `VITE_API_URL` to your live backend URL without a trailing slash. Never commit `.env` files.

---

## Local Setup

### 1. Start the backend

```bash
cd campusborrow-backend
npm install
npm start
```

`npm run dev` uses `nodemon`, so install it first (`npm install -D nodemon`) if you want auto-restart.

### 2. Start the frontend

```bash
cd campusborrow-frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal (usually http://localhost:5173).

---

## Known Limitations

* Reports are not stored in the database yet.
* Photos are stored as base64 text in MongoDB, which is fine for a small project. Cloud storage would be better at scale.
* The login token is kept in `localStorage`. HttpOnly cookies would be more secure.
* Search runs in the browser on the items already loaded.
