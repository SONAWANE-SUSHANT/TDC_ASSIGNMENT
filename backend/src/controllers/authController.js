const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/apiResponse");
const env = require("../config/env");

const login = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password?.trim();

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  if (email !== env.dummyAuthEmail || password !== env.dummyAuthPassword) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const user = {
    id: "employee-001",
    name: "Matchmaking Employee",
    email,
    role: "employee"
  };

  sendSuccess(
    res,
    {
      user,
      token: `dummy-token-${user.id}`
    },
    "Login successful"
  );
});

module.exports = { login };
