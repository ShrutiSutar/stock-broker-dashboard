const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

// In-memory user store (in production, use database)
const users = new Map();

function generateUserId(email) {
  return crypto.createHash("md5").update(email).digest("hex");
}

function login(email) {
  if (!email || !email.includes("@")) {
    throw new Error("Valid email is required");
  }

  const userId = generateUserId(email);

  // Create or get user
  if (!users.has(userId)) {
    users.set(userId, {
      userId,
      email,
      createdAt: new Date().toISOString(),
    });
  }

  // Generate JWT
  const token = jwt.sign({ userId, email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    user: {
      userId,
      email,
      createdAt: users.get(userId).createdAt,
    },
  };
}

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { login, verifyToken };
