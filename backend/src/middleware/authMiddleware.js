const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    return next(new Error("Authentication token is required"));
  }

  const token = authHeader.split(" ")[1];

  if (!token.startsWith("dummy-token-")) {
    res.status(401);
    return next(new Error("Invalid authentication token"));
  }

  req.user = {
    id: token.replace("dummy-token-", ""),
    role: "employee"
  };

  next();
};

module.exports = { protect };
