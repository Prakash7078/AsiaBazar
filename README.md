# Asia Bazzar

Asia Bazzar is a full-stack grocery and cafe commerce application. The React/Vite storefront supports product discovery, authentication, profiles, carts, checkout, order history, and an administrative operations area. The Express/MongoDB API owns identity, catalog, cart, order, upload, email, and Stripe integrations.

## Architecture

| Layer | Technology | Default port |
| --- | --- | --- |
| Web | React, Redux Toolkit, Vite, Tailwind | 5173 |
| API | Node.js, Express, Mongoose | 5001 |
| Data | MongoDB | 27017 |
| Integrations | Stripe, AWS S3, SMTP | environment-specific |

## Local development

Requirements: Node.js 20, npm 10, and MongoDB 7 (or a managed MongoDB URI).

```bash
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm run dev:server
# In a second terminal:
npm run dev:client
```

The API exposes liveness at `GET /health` and dependency readiness at `GET /ready`. Never commit `.env` files. GitHub environments and repository secrets should provide production values.

## Quality and delivery

`npm run validate` runs the same lint, API tests, and production build used by CI. Pull requests and `main` pushes run CI, dependency review, and CodeQL. Version tags (`v*.*.*`) build and publish production container images to GitHub Container Registry; deployment can then use a protected GitHub environment.

See [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), and [docs/OPERATIONS.md](docs/OPERATIONS.md).
