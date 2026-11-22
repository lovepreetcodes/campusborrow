// Two small "guards" that check the login token sent by the frontend.
// The frontend sends it in a header:  Authorization: Bearer <token>

const jwt = require('jsonwebtoken');

// Pulls the token out of the Authorization header (or returns undefined)
function getToken(req) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  return scheme === 'Bearer' ? token : undefined;
}

// Guard 1: the user MUST be logged in, otherwise the request is stopped (401)
function requireLogin(req, res, next) {
  try {
    req.userId = jwt.verify(getToken(req), process.env.JWT_SECRET).id;
    next(); // token is valid, go on to the route
  } catch {
    res.status(401).json({ message: 'Please log in again' });
  }
}

// Guard 2: logging in is OPTIONAL. If the token is valid we note who the user is,
// otherwise we just carry on as a guest.
function optionalLogin(req, res, next) {
  try {
    req.userId = jwt.verify(getToken(req), process.env.JWT_SECRET).id;
  } catch {
    // no token or invalid token = guest, nothing to do
  }
  next();
}

module.exports = { requireLogin, optionalLogin };
