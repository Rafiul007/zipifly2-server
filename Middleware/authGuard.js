const jwt = require("jsonwebtoken");
const secretKey = "rafiul";
const authGuard = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const {userName, userId} = decoded;
    req.username = userName;
    req.userId = userId;
    next();
  } catch (error) {
    console.log("Error msg", error);
    next("Authentication failure");
  }
};
module.exports = authGuard;
