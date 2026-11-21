# CampusBorrow
https://campusburrow-1.onrender.com/
A dark-themed campus item-sharing platform built to help students lend, borrow, give away, or request everyday items like books, calculators, lab gear, and notes—without heavy account walls or cluttered forms.

<!-- Replace with your full dashboard screenshot once saved -->

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

```

## Implementation Details

### 1. API Base URL & Trailing-Slash Normalization
To prevent double-slash URLs such as `https://campusburrow-1.onrender.com//api/items` when `VITE_API_URL` includes a trailing slash, `API_URL` normalizes trailing slashes before appending `/api/items`:

```javascript
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

```
## Implementation Details

### 1. API Base URL & Trailing-Slash Normalization
To prevent double-slash URLs such as `https://campusburrow-1.onrender.com//api/items` when `VITE_API_URL` includes a trailing slash, `API_URL` normalizes trailing slashes before appending `/api/items`:

```javascript
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
```

- In **Vercel Environment Variables**, `VITE_API_URL` is configured as a **Config** variable set to `https://campusburrow-1.onrender.com` (without a trailing slash).

### 2. Item Posting, Filtering, Searching & Image Display
- Users click **+ Post Item** to open the creation form and submit item details along with a **Secret Delete Key**[cite: 51, 53].
- Optional images are processed on the client with a preview before submission and fall back cleanly to a default placeholder if missing or broken[cite: 51, 53].
- Card and preview images use `object-contain` so uploaded photos and textbook or equipment visuals are shown completely without cropping.
- Users can narrow results using type pills (`All`, `Borrow`, `Giveaway`, `Request`) and type into `Search items...`[cite: 51, 52].

### 3. Item Status & Deletion with Secret Key
- Each card displays `Claim` (or `Available` if already `Claimed`) and `Delete`[cite: 51, 54].
- Clicking either action opens an inline key prompt (`Item key`) on the card[cite: 54].
- Submitting the key verifies authorization for that item and either toggles status (`available` ↔ `claimed`) or deletes the listing[cite: 51, 54].

### 4. Navbar, Branding & Frontend Report Form
- The sticky top navbar houses the brand logo and title (`UniShare` / `CampusBorrow`), `Share & borrow on campus` subtitle, **Report** button, and **+ Post Item** button[cite: 51, 52].
- Clicking **Report** toggles the report form (`showReportForm`) and closes the Post Item form if open; submitting resets the report fields and closes the form on the frontend.

### 5. Git Synchronization & Deployment Workflow
- Changes are committed locally and pushed to `origin main` on GitHub (`https://github.com/lovepreetcodes/campusburrow.git`)[cite: 57].
- If remote commits exist on `main`, `git pull --rebase origin main` is run prior to `git push` to keep commit history linear.
- **Render** builds and serves the Express API (`campusburrow-1`)[cite: 56], and **Vercel** builds and deploys `campusborrow-frontend` automatically on push[cite: 55].

---

## Local Setup & Environment Variables

### 1. Clone the Repository
```bash
git clone [https://github.com/lovepreetcodes/campusburrow.git](https://github.com/lovepreetcodes/campusburrow.git)
cd campusburrow
```

### 2. Backend Setup (`campusborrow-backend`)
Create a `.env` file inside `campusborrow-backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
```

Install dependencies and start the server:

```bash
cd campusborrow-backend
npm install
npm start
```

### 3. Frontend Setup (`campusborrow-frontend`)
Create a `.env` file inside `campusborrow-frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Install dependencies and run the Vite dev server:

```bash
cd campusborrow-frontend
npm install
npm run dev
```
