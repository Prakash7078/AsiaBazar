# Operations runbook

## Service checks

- `GET /health` confirms the API process is alive.
- `GET /ready` returns 200 only when MongoDB is connected.
- Request IDs are returned as `X-Request-Id` and included in API error responses.

## Configuration

Copy the `.env.example` files and supply secrets through the deployment platform. Use distinct keys and databases per environment. `CORS_ORIGINS` is a comma-separated allowlist. `TRUST_PROXY=1` is appropriate behind one trusted reverse proxy.

## Release and rollback

Create a semantic version tag after CI passes. The release workflow publishes immutable client and server images tagged with the Git SHA and release version. Deploy through a protected environment. Roll back by redeploying the previous known-good image tag.

## Incident response

1. Confirm impact from health checks and application logs.
2. Contain by rolling back or disabling the affected integration.
3. Rotate potentially exposed credentials.
4. Preserve relevant logs without customer secrets.
5. Record timeline, root cause, corrective actions, and owners.
