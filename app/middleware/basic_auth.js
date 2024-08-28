const basicAuth = require('basic-auth');

function basicAuthMiddleware(req, res, next) {
  const credentials = basicAuth(req);

  if (!credentials || !isValidUser(credentials.name, credentials.pass)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
    return res.status(401).json({ message: 'Authentication required.' });
  }

  next();
}

function isValidUser(username, password) {
  const validUsers = {
    "allowed": "secretpassword",
  };

  return validUsers[username] === password;
}

module.exports = basicAuthMiddleware;