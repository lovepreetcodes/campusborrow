# CampusBorrow

A simple, dark-themed campus item-sharing board where students can post items to **borrow**, **give away**, or **request**, browse listings quickly, and manage their own posts using a secret key.

<!-- Add a full dashboard screenshot here -->
![CampusBorrow Dashboard](./screenshots/dashboard.png)

## Features

- **Dashboard-First Experience:** Opens directly into a compact, multi-column item grid with a top navigation bar and a toggleable **Post Item** form.
- **Type Filtering & Keyword Search:** Filter listings by **All**, **Borrow**, **Giveaway**, or **Request**, and search live by item title or description.
- **Optional Photo Upload & Uniform Cards:** Upload an optional item photo (automatically resized in the browser before saving) with a clean default placeholder fallback when no photo is provided, keeping card layouts consistent.
- **Item Status Tracking:** View `available` and `claimed` badges at a glance, and toggle item availability using the post's secret key.
- **Owner Controls & Quick Contact:** Copy contact details in one click and handle status updates or deletions inline without browser popups.

<!-- Optional: Add a side-by-side or stacked screenshot of the Post Item form, filters, and inline actions -->
<!-- ![Post Item Form and Controls](./screenshots/post-and-controls.png) -->

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)

## Project Structure

```text
campusborrow/
├── backend/              # Express server and Mongoose models
│   ├── models/
│   │   └── Item.js
│   ├── server.js
│   └── package.json
├── frontend/             # React + Vite + Tailwind CSS dashboard
│   ├── public/
│   │   └── hero.png
│   ├── src/
│   │   ├── App.jsx
│   │   ├── imageHelper.js
│   │   └── main.jsx
│   └── package.json
└── README.md
