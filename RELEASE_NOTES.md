# L-Ease Release Notes

## v1.0.0

This release brings the core peer-to-peer asset leasing workflow together with a responsive interface, safer state transitions, and documented local setup.

### Marketplace and interface

- Browse, search, filter, sort, view, create, edit, and delete asset listings.
- Preview a replacement listing image directly in the edit control before saving.
- Refine the browse filters, asset cards, page spacing, and responsive layouts.
- Add a scalable SVG brand mark and consistent light/dark theme behavior across the main pages, inbox, and chat.
- Preserve the selected theme in the browser and respect the system theme when no preference has been saved.

### Accounts and communication

- Register and sign in with hashed passwords; renew the session ID after login.
- Edit profiles and upload profile and listing images.
- View dashboards, notifications, profile details, and review history.
- Send lease-related messages and see conversation read state.
- Restrict conversation access and message sending to eligible lease participants.

### Lease and review workflows

- Validate listing, account, profile, lease-date, message, and review input on the server.
- Require a pending request and owner authorization to approve a lease.
- Prevent date overlaps with another approved or active lease for the same asset.
- Restrict rejection and completion to the owner; allow completion only after the lease end date.
- Allow reviews only after a completed lease, derive the reviewee from the lease, and enforce one review per reviewer per lease in SQLite.

### Reliability and security

- Accept JPG/JPEG, PNG, and WebP uploads only when the extension and MIME type match; limit uploads to 5 MB.
- Use POST for logout and listing deletion.
- Wait for database schema initialization before listening for requests.
- Require `SESSION_SECRET` in production and set HTTP-only, SameSite=Lax cookies with `secure` enabled in production.
- Render user-facing error pages or JSON errors and log unexpected server errors.
- Ignore secrets, dependencies, new local SQLite runtime files, logs, OS files, and uploaded user media with `.gitignore`.

### Validation

Run the configured suite with:

```bash
npm test
```

It includes lease-model regression checks, public route and 404 smoke tests, and an application-load check. Database tests use in-memory SQLite.

### Known limitations and next steps

- Express's default in-memory session store is not suitable for production or multi-instance deployment; configure a persistent session store.
- Payment processing, email verification, password recovery, and admin moderation are not included.
- Expand multi-user end-to-end coverage for the full listing-to-lease-to-review journey.
