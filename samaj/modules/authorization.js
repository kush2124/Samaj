import jwt from "jsonwebtoken";

// Move to secrets manager
const JWT_SECRET = "nanu_manu_jhunu";
const ADMIN_JWT_SECRET = "BOSS";

const authorize = (req, res, next) => {
  authorizer(req, res, next, JWT_SECRET);
};

const adminAuthorize = (req, res, next) => {
  authorizer(req, res, next, ADMIN_JWT_SECRET);
};

const authorizer = (req, res, next, SECRET) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access denied",
    });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Access denied",
      });
    }
    req.user = user;

    next();
  });
};

const authorization = {
  authorize: authorize,
  secret: JWT_SECRET,
  adminAuthorize: adminAuthorize,
  adminSecret: ADMIN_JWT_SECRET,
};

export default authorization;
