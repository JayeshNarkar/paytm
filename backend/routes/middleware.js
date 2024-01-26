const jwt = require("jsonwebtoken");
const jwt_secret = process.env.jwt_secret;

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: req.headers });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
};

module.exports = {
  authMiddleware,
};
