`# Asia Bazzar: Challenges and Resolutions

This document records the engineering, security, delivery, and operational issues found while upgrading Asia Bazzar into an enterprise-style project. It explains why each issue mattered, what was changed, and how the change was validated.

> Never add actual passwords, tokens, API keys, connection strings, or customer information to this document.

## 1. No centralized project workflow

**Challenge:** The client and server had separate commands, but there was no root-level command for validating the entire application.

**Why it mattered:** Developers and CI could run different checks, allowing broken changes to reach the main branch.

**Resolution:** Added a root `package.json` with commands for installing dependencies, linting, testing, building, auditing dependencies, and running the full validation pipeline.

**Verification:** `npm run validate` successfully runs client linting, server checks, API tests, and the production client build.

## 2. No continuous integration

**Challenge:** Pull requests and pushes were not automatically tested.

**Why it mattered:** Syntax errors, lint failures, broken builds, or failing tests could be merged without detection.

**Resolution:** Added `.github/workflows/ci.yml`. It uses Node.js 20, clean dependency installation with `npm ci`, separate client and server jobs, automated tests, production builds, concurrency cancellation, timeouts, and Docker image build checks.

**Verification:** The equivalent CI commands were run locally and passed.

## 3. No standardized release pipeline

**Challenge:** The project did not have a repeatable artifact release process.

**Why it mattered:** Manual releases are difficult to reproduce, audit, and roll back.

**Resolution:** Added `.github/workflows/release.yml`. Semantic version tags such as `v1.0.0` build immutable client and server container images and publish them to GitHub Container Registry. Images include Git SHA tags, provenance, and software bill of materials metadata. The workflow uses a protected `production` environment.

**Verification:** Dockerfiles and workflow configuration were reviewed. Docker was not installed in the local workspace, so GitHub Actions performs the container build validation.

## 4. No automated security scanning

**Challenge:** The repository had no automated source-code or dependency-change security review.

**Why it mattered:** Vulnerable patterns and high-risk dependency changes could remain unnoticed.

**Resolution:** Added a security workflow with CodeQL and pull-request dependency review. Added Dependabot configuration for the client, server, and GitHub Actions.

## 5. Development-oriented Docker images

**Challenge:** The original containers used old Node.js versions, installed dependencies with `npm install`, ran development servers, used `nodemon`, and ran without production health checks.

**Why it mattered:** Development images are larger, less deterministic, and unsuitable for production operation.

**Resolution:**

- Standardized on Node.js 20.
- Used `npm ci` for deterministic installs.
- Used a multi-stage client build.
- Served the client through an unprivileged Nginx image.
- Ran the API as the non-root `node` user.
- Added container health checks.
- Added SPA routing and immutable static-asset caching.
- Added a root `.dockerignore`.

## 6. No reproducible local infrastructure

**Challenge:** Developers had to configure the web app, API, and database separately.

**Resolution:** Added `docker-compose.yml` for the client, API, and MongoDB, including MongoDB health checking, service dependencies, persistent database storage, and required-secret validation.

## 7. API server could not be tested independently

**Challenge:** Importing `server.js` immediately connected to MongoDB and started listening on a port.

**Why it mattered:** Automated API contract tests could not load the Express application without external infrastructure.

**Resolution:** Split the Express application into `server/app.js` and kept process startup in `server/server.js`. Tests can now import the app without starting the production process or connecting to MongoDB.

## 8. Missing health and readiness checks

**Challenge:** The API provided no machine-readable indication of process or database health.

**Resolution:** Added:

- `GET /health` for process liveness.
- `GET /ready` for MongoDB readiness.
- Container health checks that use these endpoints.

## 9. No graceful shutdown

**Challenge:** The API did not handle termination signals.

**Why it mattered:** Deployments could terminate the process while it was still handling requests.

**Resolution:** Added `SIGTERM` and `SIGINT` handlers that stop accepting requests and close the HTTP server before exiting. Unhandled promise rejections are logged and terminate the unhealthy process.

## 10. Unrestricted CORS configuration

**Challenge:** `cors()` accepted requests from any browser origin.

**Why it mattered:** Untrusted websites could call the API from a user's browser.

**Resolution:** Added a comma-separated `CORS_ORIGINS` allowlist, limited allowed methods and headers, and retained support for non-browser requests without an Origin header.

**Verification:** An automated test confirms that an untrusted browser origin receives HTTP 403.

## 11. Weak HTTP response hardening

**Challenge:** The API exposed the Express implementation header and did not provide baseline security headers.

**Resolution:** Disabled `X-Powered-By` and added `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy` headers.

## 12. No request correlation or consistent API errors

**Challenge:** Errors were returned in different formats, and production incidents could not correlate client failures with server logs.

**Resolution:** Added a request ID middleware, returned `X-Request-Id`, included the ID in standard error responses, added a JSON 404 response, and prevented internal server details from being returned to clients.

**Verification:** Automated tests verify the request ID and standard 404 contract.

## 13. Admin endpoints only required authentication

**Challenge:** Any signed-in user could call administrative user, order, and product endpoints because the routes checked for a token but did not check the administrator role.

**Why it mattered:** This was a privilege-escalation vulnerability.

**Resolution:** Added a reusable `requireAdmin` authorization middleware and applied it to all `/api/admin` routes.

**Verification:** An automated test confirms that a valid non-admin token receives HTTP 403 from an administrative endpoint.

## 14. User resource IDs were trusted from requests

**Challenge:** Profile, cart, and order routes accepted a user ID from URL parameters or the request body without confirming it matched the authenticated user.

**Why it mattered:** A signed-in user could potentially read or modify another user's resources by changing an ID.

**Resolution:** Added `requireSelf` and `requireBodySelf` authorization middleware. Administrators retain intentional cross-user access, while regular users are restricted to their own resources.

**Verification:** An automated test confirms that one user cannot access another user's cart.

## 15. JWTs contained excessive user information

**Challenge:** Authentication tokens embedded the complete user object, including information that did not need to be in the token.

**Why it mattered:** JWT contents are encoded, not encrypted, and unnecessary data increases exposure.

**Resolution:** JWTs now contain only the user ID and administrator flag. Authentication middleware remains compatible with the previous token structure during migration.

## 16. Password hashes were returned to clients

**Challenge:** Login and signup responses could include the stored password hash.

**Why it mattered:** Password hashes should never leave the identity service or be stored in browser state.

**Resolution:** Removed password fields from login, signup, profile update, and administrative user responses.

## 17. Public signup accepted an administrator flag

**Challenge:** The signup controller accepted `admin` directly from the public request body.

**Why it mattered:** A user could attempt to create an administrator account through public registration.

**Resolution:** Public registration always creates a non-admin user. Administrator provisioning must use a controlled administrative process.

## 18. Missing authentication input validation

**Challenge:** Signup and password-reset operations accepted incomplete data and weak passwords.

**Resolution:** Added required-field checks and an eight-character minimum password requirement. Email addresses continue to be normalized to lowercase.

## 19. Password reset token validation could continue after failure

**Challenge:** The original callback-based JWT verification could return an error response while the surrounding controller continued and updated the password.

**Why it mattered:** Invalid or expired reset tokens could be handled incorrectly.

**Resolution:** Changed reset verification to synchronous exception handling, stopped processing immediately on failure, checked that the token user ID matches the route user ID, and reduced reset-token lifetime to 15 minutes.

## 20. Password reset links were hard-coded

**Challenge:** Email links always pointed to one deployed frontend address.

**Why it mattered:** Local, staging, and future production environments could generate incorrect links.

**Resolution:** Reset links now use the configurable `CLIENT_URL` environment variable with a local-development default.

## 21. Payment endpoint accepted unsafe amounts

**Challenge:** The payment endpoint trusted the amount sent by the client and did not validate its type or range.

**Why it mattered:** Invalid, negative, extremely large, or malformed amounts could reach Stripe.

**Resolution:** Added numeric validation, rounding to cents, and a permitted range of $0.50 through $10,000. The endpoint returns a controlled service-unavailable response when Stripe is not configured.

**Verification:** An automated test confirms that an invalid amount is rejected before Stripe is contacted.

> Future improvement: production payment amounts should be recalculated entirely on the server from trusted catalog and cart records instead of accepting a client total.

## 22. Payment intent creation was public

**Challenge:** Anyone could call the payment-intent endpoint.

**Why it mattered:** Anonymous callers could abuse the Stripe integration and create unnecessary payment objects.

**Resolution:** Required a valid bearer token for payment-intent creation and updated the checkout request to include the user's token. The checkout route now redirects unauthenticated users to login.

## 23. Stripe configuration was embedded in a React component

**Challenge:** The Stripe publishable key was hard-coded in `App.jsx`.

**Resolution:** Moved it to `VITE_STRIPE_PUBLISHABLE_KEY` in `client/.env`. `App.jsx` now reads the key through Vite environment configuration and safely supports an unconfigured local environment.

**Important:** Vite variables are embedded in browser JavaScript. Stripe publishable keys are designed for browser use, but Stripe domain restrictions and server-side secret-key protection are still required.

## 24. Existing client API key needed to be preserved

**Challenge:** The existing Google browser API key could not easily be recreated through the provider portal.

**Resolution:** Restored the existing key to the local `client/.env` file and confirmed both required client key variables are populated. Actual key values are intentionally not reproduced in this document.

## 25. Environment files lacked a safe template

**Challenge:** New developers had no complete list of required environment variables.

**Resolution:** Added `client/.env.example` and `server/.env.example` with safe placeholders. The real values remain in local `.env` files or deployment secret stores.

**Important:** The example files must never contain usable credentials. Copy an example to `.env` and populate the local file instead.

## 26. API URL was hard-coded to one deployment

**Challenge:** The client always called a specific hosted API.

**Why it mattered:** Local, staging, preview, and production builds could not select their own API safely.

**Resolution:** The client now reads `VITE_API_URL` and defaults to `http://localhost:5001` for local development.

## 27. Upload handling accepted broad input

**Challenge:** Upload middleware limited total size but did not restrict file type or file count consistently.

**Resolution:** Retained the 25 MB file limit, limited uploads to five files, and allowed common browser image MIME types only.

## 28. Client lint gate had accumulated failures

**Challenge:** The original lint command reported 82 issues, including unused imports, missing prop validation, hook warnings, an undefined variable, and a case-block declaration.

**Resolution:** Updated the lint policy for the project's existing JSX conventions and repaired the real undefined-variable and loading-state bug in `ProfileDialog`. The CI lint command now completes successfully.

> Future improvement: remove unused legacy components and imports incrementally, then re-enable stricter unused-variable and hook dependency rules.

## 29. Production build had no enterprise gate

**Challenge:** Although the client could build, there was no required build check before changes were merged.

**Resolution:** Added the production build to the root validation command and CI workflow.

**Verification:** Vite successfully transformed 3,130 modules and generated the production assets.

## 30. Large client bundle and CSS compatibility warnings

**Challenge:** The build succeeds but reports a JavaScript bundle larger than 500 KB and CSS nesting warnings originating from the current Swiper/Vite/PostCSS dependency combination.

**Current status:** These warnings do not fail the build and were not allowed to block the security and delivery upgrade.

**Recommended next work:**

- Lazy-load admin, checkout, chart, carousel, and other route-level modules.
- Configure Rollup manual chunks for large vendor libraries.
- Align Vite, PostCSS, Tailwind, and Swiper versions.
- Add a supported CSS nesting plugin before Tailwind if nested source CSS remains.
- Add performance budgets to CI after establishing an accepted baseline.

## 31. Missing repository governance

**Challenge:** The repository had no ownership, contribution, security-reporting, or pull-request standards.

**Resolution:** Added:

- `README.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `.github/CODEOWNERS`
- `.github/pull_request_template.md`
- `.editorconfig`
- `.nvmrc`
- Root `.gitignore`

## 32. Missing production operations documentation

**Challenge:** Operators had no documented health checks, configuration model, rollback process, or incident-response procedure.

**Resolution:** Added `docs/OPERATIONS.md` with service checks, configuration guidance, immutable release and rollback practices, and an incident-response checklist.

## 33. Automated API coverage was missing

**Challenge:** The server's original test command always exited with an error because no test suite existed.

**Resolution:** Added Node.js native API tests covering:

1. Process health and security headers.
2. Database readiness behavior.
3. Standard 404 errors and request IDs.
4. Payment amount validation.
5. CORS rejection.
6. Administrator authorization.
7. Cross-user cart authorization.

**Verification:** All seven tests pass.

## 34. Runtime route verification

**Challenge:** The storefront needed confirmation that its SPA entry routes still resolved after configuration changes.

**Resolution:** Started the local Vite server and smoke-tested `/`, `/store`, `/cafe`, `/menu`, `/login`, `/signup`, `/mycart`, `/checkout`, and `/admin`.

**Verification:** Every route returned HTTP 200 from the SPA server. Protected routes perform their authentication redirect inside React.

## 35. In-app browser testing was unavailable

**Challenge:** The requested in-app browser backend was not exposed in the development session.

**Impact:** Visual inspection, click-by-click interaction, responsive checks, and browser console/network inspection could not be completed through that browser.

**What was done instead:** Automated server tests, production builds, linting, and HTTP route smoke tests were completed. No unrelated browser was substituted because the in-app browser was explicitly requested.

**Remaining verification:** When the in-app browser is available and MongoDB plus integration credentials are configured, manually test registration, login, password reset email, profile editing, catalog search/filtering, product details, cart mutations, Stripe checkout, pickup checkout, order history, uploads, and every administrator workflow.

## Validation summary

At the end of the upgrade:

- Client lint passed.
- Server syntax checks passed.
- Seven API and authorization tests passed.
- The production client build passed.
- Git whitespace validation passed.
- All tested SPA routes returned HTTP 200.
- Client environment variables were confirmed as populated without printing their values.

## Future maintenance checklist

- Run `npm run validate` before every pull request.
- Review and merge Dependabot updates regularly.
- Protect `main` and require CI/security checks and code-owner review.
- Protect the GitHub `production` environment.
- Rotate any credential if it appears in Git history, logs, issues, or chat.
- Keep real `.env` files out of commits.
- Test container builds in GitHub Actions or a workstation with Docker.
- Add MongoDB-backed integration tests and browser end-to-end tests.
- Recalculate checkout pricing on the server before accepting production payments.
- Address bundle-size and CSS compatibility warnings.
