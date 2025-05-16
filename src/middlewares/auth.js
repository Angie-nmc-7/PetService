const admin = require("../firebase");

async function checkAuth(req, res, next) {
  const sessionCookie = req.cookies.session || "";

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    req.user = decodedClaims;
    next();
  } catch (error) {
    res.redirect("/login");
  }
}

module.exports = { checkAuth };
