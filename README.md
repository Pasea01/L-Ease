# L-Ease

L-Ease is a full-stack peer-to-peer asset leasing platform built with Node.js and Express. It allows users to list assets for rent, browse listings, request leases, communicate with other users, and leave reviews after a completed agreement.

The platform supports a wide range of rentable assets, including:

- Houses and apartments
- Vehicles
- Electronics
- Tools and equipment
- Furniture
- Other rentable items and equipment

## Project Overview

L-Ease is designed around a marketplace model where:

- Asset owners create listings for items they want to rent out
- Tenants browse and search for available assets
- Potential renters submit lease requests
- Owners approve or reject the request
- Approved lease participants can message each other
- Users can review each other after a lease is completed
- Notifications keep users informed of important activity

This is a server-rendered web application using EJS templates and a SQLite database, rather than a client-side JavaScript framework.

## Current Status

The project is in active development but already includes the core marketplace flow, authentication, asset management, leasing, messaging, reviews, and notifications.

## Features Implemented

### Authentication and user accounts
- User registration with full name, email, phone, password
- Password hashing with bcrypt
- Login and logout
- Session-based authentication with session ID renewal at login
- User profile management
- Profile image upload and display
- Server-side validation for registration and profile updates

### Marketplace and asset listings
- Create new listings
- View all listings in the marketplace
- Search listings by title/description
- Filter by category, location, and price range
- Sort by newest, oldest, lowest price, or highest price
- View listing details
- Edit listing details and image
- Preview a replacement image immediately while editing a listing
- Delete listing
- My listings page for the logged-in user
- Server-side listing validation and owner-only listing management

### Lease request workflow
- Users can request to lease a listing they do not own
- Owners see incoming lease requests
- Owners can approve or reject lease requests
- Tenant sees their own requests
- Lease dates are validated, and approvals are limited to pending requests
- Approval prevents overlapping approved or active leases for the same asset
- Only the asset owner can approve, reject, or complete a lease
- A lease can only be marked completed after its end date
- Conversations are restricted to participants in an eligible lease for the asset

### Messaging system
- Inbox page for all conversations
- Conversation pages between two users for a specific asset
- Message sending and retrieval
- Automatic notifications when a new message arrives
- Access checks before opening a conversation or sending a message
- Message length limits and read-state updates
- Light and dark theme styling for the inbox and conversation views

### Reviews and ratings
- Reviews are limited to participants in a completed lease
- One review per lease per reviewer, enforced by a SQLite unique index
- Users can submit a rating from 1 to 5 stars with optional comments
- Reviews appear on listing detail pages and user profiles
- Average rating stats are computed for users and listings
- Homepage displays recent reviews

### Interface and feedback
- Responsive server-rendered pages built with EJS
- Light and dark themes, with the selected theme saved in the browser and system preference used by default
- Consistent page spacing, updated marketplace filters/cards, and an inline listing-image editor
- Flash feedback for user-facing technical errors and a rendered error page for failed requests

### Notifications
- New lease request notifications
- Lease approval notifications
- New message notifications
- New review notifications
- Notification center with unread count
- Mark individual notifications or all notifications as read

### Dashboard and profile insights
- Dashboard summary for listings, pending requests, unread messages, and reviews
- Recent activity feed for listings, lease requests, and messages
- Profile page showing user details, averages, and review history
- Review history page

## Tech Stack

- Node.js
- Express.js
- SQLite3
- EJS
- HTML5
- CSS3
- JavaScript
- bcrypt
- express-session
- multer
- express-validator

## Project Structure

```text
L-Ease/
├── README.md
├── .gitignore
├── .env.example
├── RELEASE_NOTES.md
├── package.json
├── package-lock.json
├── server/
│   ├── app.js
│   ├── config/
│   │   └── multer.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── homeController.js
│   │   ├── leaseController.js
│   │   ├── listingController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   ├── database/
│   │   ├── db.js
│   │   ├── initDatabase.js
│   │   ├── lease.db
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   └── seedDatabase.js
│   ├── helpers/
│   │   ├── categoryImage.js
│   │   ├── imageUpload.js
│   │   ├── listingImage.js
│   │   └── profileImage.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── notificationMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── Lease.js
│   │   ├── Listing.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Review.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── leaseRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── pageRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
├── src/
│   ├── public/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   ├── uploads/
│   │   ├── profiles/
│   │   └── (listing image files)
│   └── views/
│       ├── About.ejs
│       ├── conversation.ejs
│       ├── dashboard.ejs
│       ├── edit-listing.ejs
│       ├── edit-profile.ejs
│       ├── error.ejs
│       ├── inbox.ejs
│       ├── index.ejs
│       ├── lease-request.ejs
│       ├── listing-details.ejs
│       ├── login.ejs
│       ├── marketplace.ejs
│       ├── my-listings.ejs
│       ├── new-listing.ejs
│       ├── owner-requests.ejs
│       ├── profile.ejs
│       ├── register.ejs
│       ├── review-form.ejs
│       ├── reviews.ejs
│       ├── tenant-requests.ejs
│       └── partials/
│           ├── footer.ejs
│           ├── head.ejs
│           ├── navbar.ejs
│           ├── scripts.ejs
├── test/
│   ├── leaseModel.test.js
│   └── routesSmoke.test.js
└── node_modules/
```

## Database Design

The app uses SQLite with a schema defined in [server/database/schema.sql](server/database/schema.sql). The main tables are:

### users
Stores user account data:
- id
- full_name
- email
- password
- phone
- profile_image
- role
- created_at
- updated_at

### assets
Stores rentable asset metadata:
- id
- owner_id
- title
- description
- category
- price_per_day
- location
- image_url
- status
- created_at
- updated_at

### asset_images
Stores additional images for an asset when multiple images are needed.

### leases
Stores rental requests and lease agreements:
- id
- asset_id
- owner_id
- tenant_id
- start_date
- end_date
- message
- status
- created_at
- updated_at

Allowed lease statuses include:
- pending
- approved
- active
- completed
- cancelled

### reviews
Stores rating and written feedback:
- id
- lease_id
- reviewer_id
- reviewed_user_id
- rating
- comment
- created_at
- updated_at

### messages
Stores private communication between users about a specific asset:
- id
- sender_id
- receiver_id
- asset_id
- message
- is_read
- created_at

### notifications
Stores user notifications:
- id
- user_id
- title
- message
- link
- is_read
- created_at

## Route and Page Overview

### Public routes
- GET / — home page with featured listings and recent reviews
- GET /login — login page
- GET /register — registration page
- GET /about — about page

### Listing routes
- GET /listings — marketplace view
- GET /api/listings and GET /listings/api — JSON API for listings
- GET /listings/my-listings — current user’s listings
- POST /listings/create — create new listing
- POST /listings/delete/:id — delete listing
- GET /listings/edit/:id — edit listing page
- POST /listings/edit/:id — update listing
- GET /listings/:id — listing details page

### Authentication routes
- POST /auth/register — register account
- GET /auth/login — login page
- POST /auth/login — authenticate user
- POST /auth/logout — logout

### Lease routes
- GET /leases/request/:assetId — request lease form
- POST /leases/request — create lease request
- GET /leases/owner — requests received by current owner
- POST /leases/:id/approve — approve request
- POST /leases/:id/reject — reject request
- GET /leases/my-requests — tenant’s submitted requests
- POST /leases/:id/complete — mark a lease as completed

### Message routes
- GET /messages — inbox
- POST /messages/send — send a message
- GET /messages/:assetId/:otherUserId — conversation view

### Review routes
- GET /reviews/new/:leaseId — review form
- POST /reviews/create — submit review

### User profile routes
- GET /profile — user profile page
- GET /profile/edit — edit profile page
- POST /profile/edit — update profile information
- GET /profile/reviews — user review history

### Notification routes
- GET /notifications/:id — open and mark a notification as read
- POST /notifications/mark-all-read — mark all notifications as read

## User Flow Example

A typical user journey in the app looks like this:

1. Register or log in
2. Create a listing for a rentable asset
3. Browse the marketplace or search for an item
4. Submit a lease request for an asset
5. Owner reviews request and approves or rejects it
6. Approved users can exchange messages in the inbox
7. Once the lease ends, users can leave a rating/review
8. Notifications track all major updates

## Setup and Installation

### Prerequisites
- Node.js 18 or later recommended
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

Copy `.env.example` to `.env` in the project root and set a unique session secret:

```env
PORT=3000
SESSION_SECRET=replace-with-a-long-random-secret
```

Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
`SESSION_SECRET` is required when `NODE_ENV=production`.

### 3. Start the app

#### Production mode

```bash
npm start
```

#### Development mode

```bash
npm run dev
```

### 4. Open the app

Open your browser at:

```text
http://localhost:3000
```

## Important App Behavior

- Access to protected pages is enforced by the auth middleware.
- Users cannot lease their own listing.
- Lease requests require valid dates; approval is limited to pending requests and prevents overlaps with approved or active leases for that asset.
- Only the owner can approve, reject, or complete a lease, and completion is unavailable until the lease end date.
- Message access and sending are limited to participants in an eligible lease for that asset.
- Reviews require a completed lease, are limited to its participants, and can be submitted only once per reviewer per lease.
- Image uploads require matching JPG/JPEG, PNG, or WebP extensions and MIME types, and are limited to 5 MB.
- Logout and listing deletion use POST requests rather than state-changing GET requests.
- The database schema is initialized before the application starts accepting requests.

## Security and Data Handling

- Passwords are hashed before being saved.
- Sessions use HTTP-only, SameSite=Lax cookies; secure cookies and a configured `SESSION_SECRET` are required in production.
- The default Express in-memory session store is intended for development only. Configure a persistent store before production or multi-instance deployment.
- Database operations are performed with SQLite using the project’s database wrapper.
- Access checks are enforced in both the middleware and controller logic before sensitive actions are allowed.
- User-facing errors are rendered as HTML or returned as JSON for API requests; unexpected server errors are logged.

## Data and Upload Locations

### SQLite database
The app creates the SQLite database at startup. By default, it uses:

```text
server/database/lease.db
```

The database schema and indexes are initialized by [server/database/initDatabase.js](server/database/initDatabase.js) before the server begins listening. Set `DATABASE_PATH` to use another database file. The seed SQL is not run automatically. New local SQLite database files and their journal/WAL sidecars are ignored by Git. The default `lease.db` is already tracked in this repository; ignore rules do not stop Git from tracking an existing file.

### Image uploads
Uploaded images are stored in:

- `src/uploads/profiles/`
- `src/uploads/` for listing images

They are served via the app from `/uploads`.
Uploaded user images are ignored by Git; the default profile image is retained.

## Tests

Run the configured tests with:

```bash
npm test
```

The test command runs:

- Lease transition, owner authorization, overlap, conversation-access, and duplicate-review regression checks.
- Public route smoke checks for the home, about, login, registration, marketplace, and listings API routes, plus the 404 page.
- An application-load check.

The database tests use in-memory SQLite and do not modify the project database.

## Notes on Current State

The application already includes a substantial portion of the marketplace lifecycle, including:

- authentication
- listing CRUD
- marketplace search and filtering
- lease requests and approvals
- messaging
- notifications
- reviews
- dashboard/profile features

The current MVP does not include payment processing, email verification or password recovery, admin moderation workflows, or a persistent production session store. Add these before relying on the app for production transactions or multi-instance deployment.

## Author

John Pasea
