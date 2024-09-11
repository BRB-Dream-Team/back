const basicAuth = (req, res, next) => {
    // Function to decode base64
    const decodeBase64 = (str) => Buffer.from(str, 'base64').toString('utf-8');
  
    // Check for Authorization header
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).json({ message: 'Forbidden' });
    }
  
    // Check if it's Basic Auth
    const auth = authHeader.split(' ');
    if (auth[0] !== 'Basic') {
        return res.status(401).json({ message: 'Forbidden' });
    }
  
    // Decode credentials
    const decodedCredentials = decodeBase64(auth[1]);
    const [username, password] = decodedCredentials.split(':');
  
    // Here you should implement your own logic to check the username and password
    // This is just a simple example
    if (username === process.env.API_USER && password === process.env.API_PASS) {
        // Authentication successful
        req.user = username;
        next();
    } else {
        // Authentication failed
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        res.status(401).json({ message: 'Forbidden' });
    }
};
  
module.exports = basicAuth;