const jwt = require("jsonwebtoken");
const secretKey = "rafiul";
const authGuard = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    req.userData = decoded;
    next();
  } catch (error) {
    console.log("Error msg", error);
    next("Authentication failure");
  }
};
module.exports = authGuard;
