# L-Ease Release Notes

## v1.0.0

This release completes the core marketplace flow for L-Ease, a peer-to-peer asset leasing platform.

### Included features

- User registration and login with sessions
- Password hashing and protected routes
- Asset listing creation, edit, and deletion
- Search, filtering, and sorting in the marketplace
- Lease request creation and approval workflow
- Messaging between tenants and owners
- Review and rating system
- Notification center with unread tracking
- Dashboard and profile views with activity and stats
- Upload support for profile and listing images

### Notes

- The app is built with Node.js, Express, SQLite, EJS, and CSS.
- Uploaded media is handled in the project upload directories.
- CI is configured with a GitHub Actions smoke test to validate the app loads successfully.

### Suggested next improvements

- Add stronger validation and sanitization
- Expand admin moderation tools
- Add payment and billing flow
- Add more advanced search and filtering options
- Improve mobile responsiveness and UX polish
