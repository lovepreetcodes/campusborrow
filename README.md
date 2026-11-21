# CampusBorrow

A dark-themed campus item-sharing platform built to help students lend, borrow, give away, or request everyday items like books, calculators, lab gear, and notes—without heavy account walls or cluttered forms.

<!-- Replace with your full dashboard screenshot once saved -->
![CampusBorrow Dark Dashboard](./screenshots/dashboard.png)

## Key Features

### 1. Dashboard-First Layout & Toggleable Post Form
- **Immediate Item Grid:** Opens straight onto the live items board so students can browse right away.
- **Top Navigation Bar:** Displays the **CampusBorrow** brand mark (`public/hero.png`) and a **+ Post Item** toggle button.
- **Collapsible Form:** Clicking **+ Post Item** reveals the creation form with fields for title, listing type (`borrow`, `giveaway`, `request`), contact info, description, optional photo, and a secret key to manage the post later.

<!-- Add a screenshot of the Post Item form open with photo preview -->
![Post Item Form](./screenshots/post-form.png)

### 2. Filtering & Keyword Search
- **Category / Type Pills:** Filter items quickly by **All**, **Borrow**, **Giveaway**, or **Request**.
- **Instant Keyword Search:** Search across item titles and descriptions as you type to narrow down listings.

### 3. Optional Image Upload & Uniform Card Grid
- **Client-Side Image Resizing:** Selected photos are resized in the browser via HTML5 `<canvas>` before being sent to the backend, helping keep payload sizes manageable.
- **Uniform Card Proportions:** Every card renders images inside a fixed-height container (`object-cover`) so cards stay aligned even when uploaded photos have different dimensions.
- **Default Placeholder Fallback:** Items posted without an image—or whose image fails to load—automatically fall back to a default placeholder graphic.

### 4. Item Lifecycle, Inline Key Actions & One-Click Contact
- **Status Badges (`available` / `claimed`):** Clearly shows whether an item is open or already claimed.
- **Owner Key Verification:** Item owners can toggle status (`Mark Available` / `Mark Claimed`) or remove a listing (`Delete`) using the secret key entered when posting.
- **Inline Action Controls:** Key prompts and error feedback appear directly inside the card rather than blocking browser popups.
- **One-Click Contact Copy:** Copy a poster's contact detail to the clipboard with visual `Copied!` confirmation.

<!-- Add a screenshot showing status badges, inline key input, and contact copy -->
![Card Actions and Status](./screenshots/item-actions.png)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB (local MongoDB or MongoDB Atlas)

## Project Structure
Getting Started (Local Setup)
Prerequisites
Make sure you have the following installed on your machine:

Node.js (v18 or higher recommended) and npm

MongoDB (either a local MongoDB instance or a free MongoDB Atlas cluster URI)

Git (optional, for cloning or contributing)

Step 1: Clone the Repository
Bash
git clone [https://github.com/](https://github.com/)<your-username>/<your-repo-name>.git
cd <your-repo-name>
Step 2: Configure & Start the Backend
Navigate to the backend directory and install dependencies:

Bash
cd backend
npm install
Create a .env file inside backend/:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
Start the backend server (uses nodemon if configured in dev, or node server.js):

Bash
npm run dev
You should see confirmation that the server is listening on port 5000 and connected to MongoDB.

Step 3: Configure & Start the Frontend
Open a new terminal window, go to the frontend folder, and install dependencies:

Bash
cd frontend
npm install
Start the Vite development server:

Bash
npm run dev
Open the local URL shown in the terminal (typically http://localhost:5173) in your browser.

Step 4: Verify Everything Works Together
Confirm the backend is running on http://localhost:5000 and the frontend is running on http://localhost:5173.

Click + Post Item, fill in the fields and a secret key, and submit.

Test filtering by type, searching by keyword, copying contact info, toggling status with your key, and deleting the test post.
```text
campusborrow/
├── backend/
│   ├── models/
│   │   └── Item.js          # Mongoose schema (title, type, status, contact, description, imageUrl, deleteKey)
│   ├── .env                 # Environment variables (not committed to Git)
│   ├── package.json
│   └── server.js            # Express app, routes, and body parser setup
├── frontend/
│   ├── public/
│   │   └── hero.png         # App icon/brand mark
│   ├── src/
│   │   ├── App.jsx          # Main dashboard UI, filters, search, form, and inline actions
│   │   ├── imageHelper.js   # Browser canvas image resizer and default placeholder fallback
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── screenshots/             # Add your demo images here
└── README.md

