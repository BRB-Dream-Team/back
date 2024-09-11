const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assuming you have a User model

const authMiddleware = async (req, res, next) => {
    // Function to decode base64
    const decodeBase64 = (str) => Buffer.from(str, 'base64').toString('utf-8');

    // Define routes that don't require Bearer token authentication
    const bearerExemptRoutes = [
        { path: '/specifics', method: 'GET' },
        { path: '/users/register', method: 'POST' },
        { path: '/users/login', method: 'POST' }
    ];

    // Check for Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).json({ message: 'Basic Authentication required' });
    }

    const authParts = authHeader.split(',').map(part => part.trim());
    let basicAuth, bearerAuth;

    authParts.forEach(part => {
        if (part.startsWith('Basic')) basicAuth = part;
        if (part.startsWith('Bearer')) bearerAuth = part;
    });

    // Check Basic Auth (required for all requests)
    if (!basicAuth) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
        return res.status(401).json({ message: 'Basic Authentication required' });
    }

    try {
        // Verify Basic Auth
        const [, basicCredentials] = basicAuth.split(' ');
        const decodedCredentials = decodeBase64(basicCredentials);
        const [username, password] = decodedCredentials.split(':');

        if (username !== process.env.API_USER || password !== process.env.API_PASS) {
            res.setHeader('WWW-Authenticate', 'Basic realm="Restricted Area"');
            return res.status(401).json({ message: 'Invalid API credentials' });
        }

        // Check if the current request is exempt from Bearer token authentication
        const isBearerExempt = bearerExemptRoutes.some(route => 
            req.path === route.path && req.method === route.method
        );

        let isAdmin = false;
        if (bearerAuth && !isBearerExempt) {
            const [, token] = bearerAuth.split(' ');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = user;
            req.token = token;
            isAdmin = User.isAdmin(user.user_id);

            // Check if the route is within /users range and requires ID matching
            if (req.path.startsWith('/users/') && req.params.id) {
                const requestedUserId = parseInt(req.params.id);
                if (requestedUserId !== user.user_id && !isAdmin) {
                    return res.status(403).json({ message: 'Forbidden: You can only access your own user data' });
                }
            }
        } else {
            // If no Bearer token or it's an exempt route, set a default user
            req.user = { user_id: 0, isAdmin: false };
        }

        // Route-specific access control
        const restrictedRoutes = ['/phones', '/entrepreneurs', '/contributors', '/categories', '/regions', '/startups', '/contributions', '/users'];
        const isRestrictedRoute = restrictedRoutes.some(route => req.path.startsWith(route));

        if (isRestrictedRoute && (req.method !== 'GET' || req.method !== 'POST') && !isAdmin) {
            return res.status(403).json({ message: 'Forbidden: Only GET method is allowed for non-admin users on this route' });
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Internal server error during authentication' });
    }
};

module.exports = authMiddleware;