const authGuard = (req, res, next) => {
  console.log("Auth guard middleware");
};
module.exports = authGuard;
