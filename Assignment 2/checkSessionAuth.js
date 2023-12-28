function checkSessionAuth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/api/users/login");
  }
}

module.exports = checkSessionAuth;
