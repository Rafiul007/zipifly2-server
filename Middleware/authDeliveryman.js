const jwt = require("jsonwebtoken");
const secretKey = "deliveryman";

const authDeliveryman = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .send({ error: true, message: "Token not provided" });
    const decoded = jwt.verify(token, secretKey);
    const { userName, userId } = decoded;
    req.username = userName;
    req.userId = userId;
    next();
  } catch (error) {
    console.log("Error msg", error);
    next("Authentication failure");
  }
};

module.exports = authDeliveryman;
