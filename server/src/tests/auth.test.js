const { login, verifyToken } = require("../auth");

describe("Authentication", () => {
  beforeEach(() => {
    // Clear any stored users between tests
    jest.resetModules();
  });

  test("should login with valid email", () => {
    const email = "test@example.com";
    const result = login(email);

    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("user");
    expect(result.user.email).toBe(email);
    expect(result.user.userId).toBeDefined();
  });

  test("should throw error for invalid email", () => {
    expect(() => login("invalid-email")).toThrow("Valid email is required");
  });

  test("should verify valid token", () => {
    const email = "test@example.com";
    const { token } = login(email);

    const decoded = verifyToken(token);
    expect(decoded).toBeTruthy();
    expect(decoded.email).toBe(email);
  });

  test("should return null for invalid token", () => {
    const decoded = verifyToken("invalid-token");
    expect(decoded).toBeNull();
  });
});
