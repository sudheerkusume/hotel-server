const jwt = require("jsonwebtoken");

const routeAuth1 = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, "hotel"); // secret must match login
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Invalid token:", err.message);
    res.status(400).send("Invalid Token");
  }
};

module.exports = routeAuth1;
