const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";
process.env.CORS_ORIGINS = "http://localhost:5173";

const app = require("../app");

async function withServer(run) {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  try {
    const { port } = server.address();
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test("health endpoint reports process liveness and security headers", () => withServer(async (baseUrl) => {
  const response = await fetch(`${baseUrl}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.ok(response.headers.get("x-request-id"));
}));

test("readiness reports unavailable without a database", () => withServer(async (baseUrl) => {
  const response = await fetch(`${baseUrl}/ready`);
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { status: "not-ready" });
}));

test("unknown routes use the standard error contract", () => withServer(async (baseUrl) => {
  const response = await fetch(`${baseUrl}/does-not-exist`);
  const body = await response.json();
  assert.equal(response.status, 404);
  assert.equal(body.message, "Route not found");
  assert.ok(body.requestId);
}));

test("payment endpoint validates amount before contacting Stripe", () => withServer(async (baseUrl) => {
  const token = jwt.sign({ userId: "507f1f77bcf86cd799439011", admin: false }, process.env.JWT_SECRET);
  const response = await fetch(`${baseUrl}/create-payment-intent`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ amount: -1 }),
  });
  assert.equal(response.status, 400);
  assert.match((await response.json()).message, /Amount/);
}));

test("CORS rejects origins outside the allowlist", () => withServer(async (baseUrl) => {
  const response = await fetch(`${baseUrl}/health`, { headers: { origin: "https://untrusted.example" } });
  assert.equal(response.status, 403);
}));

test("non-admin tokens cannot access administrative APIs", () => withServer(async (baseUrl) => {
  const token = jwt.sign({ userId: "507f1f77bcf86cd799439011", admin: false }, process.env.JWT_SECRET);
  const response = await fetch(`${baseUrl}/api/admin/getUsers`, {
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(response.status, 403);
}));

test("users cannot access another user's cart", () => withServer(async (baseUrl) => {
  const token = jwt.sign({ userId: "507f1f77bcf86cd799439011", admin: false }, process.env.JWT_SECRET);
  const response = await fetch(`${baseUrl}/api/products/getCartItems/507f191e810c19729de860ea`, {
    headers: { authorization: `Bearer ${token}` },
  });
  assert.equal(response.status, 403);
}));
