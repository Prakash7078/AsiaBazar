const test = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");

process.env.JWT_SECRET = "test-secret-that-is-longer-than-thirty-two-characters";

const User = require("../models/userModel");
const { login } = require("../controllers/authController");

function createResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    send(payload) {
      this.body = payload;
      return this;
    },
  };
}

function stubFindOne(user) {
  const originalFindOne = User.findOne;
  User.findOne = () => ({
    lean: async () => user,
  });
  return () => {
    User.findOne = originalFindOne;
  };
}

test("login returns 400 when credentials are missing", async () => {
  const response = createResponse();

  await login({ body: { data: { email: "" } } }, response, () => {});

  assert.equal(response.statusCode, 400);
  assert.deepEqual(response.body, { error: "Email and password are required" });
});

test("login returns 401 when email is not registered", async () => {
  const restoreFindOne = stubFindOne(null);
  const response = createResponse();

  try {
    await login({
      body: { data: { email: "missing@example.com", password: "password123" } },
    }, response, () => {});
  } finally {
    restoreFindOne();
  }

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { error: "Invalid email or password" });
});

test("login returns 401 when password is wrong", async () => {
  const restoreFindOne = stubFindOne({
    _id: "507f1f77bcf86cd799439011",
    email: "user@example.com",
    password: bcrypt.hashSync("correct-password", 10),
    admin: false,
  });
  const response = createResponse();

  try {
    await login({
      body: { data: { email: "user@example.com", password: "wrong-password" } },
    }, response, () => {});
  } finally {
    restoreFindOne();
  }

  assert.equal(response.statusCode, 401);
  assert.deepEqual(response.body, { error: "Invalid email or password" });
});

test("login returns token and safe user when credentials are valid", async () => {
  const restoreFindOne = stubFindOne({
    _id: "507f1f77bcf86cd799439011",
    name: "Asia User",
    email: "user@example.com",
    password: bcrypt.hashSync("correct-password", 10),
    admin: false,
  });
  const response = createResponse();

  try {
    await login({
      body: { data: { email: "USER@EXAMPLE.COM ", password: "correct-password" } },
    }, response, () => {});
  } finally {
    restoreFindOne();
  }

  assert.equal(response.statusCode, 200);
  assert.ok(response.body.token);
  assert.equal(response.body.user.email, "user@example.com");
  assert.equal(response.body.user.password, undefined);
});
