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
- Session-based authentication
- User profile management
- Profile image upload and display

### Marketplace and asset listings
- Create new listings
- View all listings in the marketplace
- Search listings by title/description
- Filter by category, location, and price range
- Sort by newest, oldest, lowest price, or highest price
- View listing details
- Edit listing details and image
- Delete listing
- My listings page for the logged-in user

### Lease request workflow
- Users can request to lease a listing they do not own
- Owners see incoming lease requests
- Owners can approve or reject lease requests
- Tenant sees their own requests
- Completed leases can be marked as completed
- Access to conversations is restricted to approved/completed lease participants only

### Messaging system
- Inbox page for all conversations
- Conversation pages between two users for a specific asset
- Message sending and retrieval
- Automatic notifications when a new message arrives
- Access protection for lease-based conversations

### Reviews and ratings
- One review per lease per reviewer
- Users can submit a rating from 1 to 5 stars with optional comments
- Reviews appear on listing detail pages and user profiles
- Average rating stats are computed for users and listings
- Homepage displays recent reviews

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
├── package.json
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
│   │   ├── listingImage.js
│   │   └── profileImage.js
│   ├── middleware/
│   │   ├── authMiddleware.js
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
│   └── uploads/
│       ├── profiles/
│       └── listings/
├── src/
│   ├── public/
│   │   ├── css/
│   │   ├── images/
│   │   └── js/
│   ├── uploads/
│   │   ├── profiles/
│   │   └── listings/
│   └── views/
│       ├── About.ejs
│       ├── conversation.ejs
│       ├── dashboard.ejs
│       ├── edit-listing.ejs
│       ├── edit-profile.ejs
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
- GET /listings/api — JSON API for listings
- GET /listings/my-listings — current user’s listings
- POST /listings/create — create new listing
- GET /listings/delete/:id — delete listing
- GET /listings/edit/:id — edit listing page
- POST /listings/edit/:id — update listing
- GET /listings/:id — listing details page

### Authentication routes
- POST /auth/register — register account
- GET /auth/login — login page
- POST /auth/login — authenticate user
- GET /auth/logout — logout

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

The app loads environment variables from a `.env` file. Create a `.env` file in the project root with at least:

```env
PORT=3000
SESSION_SECRET=your_secure_session_secret
```

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
- Message access is limited to users involved in an approved or completed lease for that asset.
- Reviews can only be submitted once per lease and per reviewer.
- Profile images and listing images are stored in upload folders and served from the public upload directories.

## Security and Data Handling

- Passwords are hashed before being saved.
- Sessions are tracked server-side with Express Session.
- Database operations are performed with SQLite using the project’s database wrapper.
- Access checks are enforced in both the middleware and controller logic before sensitive actions are allowed.

## Data and Upload Locations

### SQLite database
The project creates and uses a SQLite database at:

```text
server/database/lease.db
```

The database is initialized by [server/database/initDatabase.js](server/database/initDatabase.js), which loads the schema and seed data.

### Image uploads
Uploaded images are stored in:

- `src/uploads/profiles/`
- `src/uploads/listings/`

They are served via the app from `/uploads`.

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

The project still has room for enhancements such as stronger validation, payment flow, more advanced moderation, role-based admin tooling, and more polished UX improvements.

## Author

John Pasea
