const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    const publicRoutes = [
        { path: '/users/register', method: 'POST' },
        { path: '/users/login', method: 'POST' },
        { path: '/api-docs', method: 'GET' }
    ];

    const isPublicRoute = publicRoutes.some(route => 
        (req.path === route.path || 
         (route.path === '/api-docs' && req.path.startsWith('/api-docs/'))) && 
        req.method === route.method
    );

    if (isPublicRoute) {
        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Bearer token required' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        req.token = token;

        if (user.role === "banker") {
            return res.status(403).json({ message: 'Forbidden: You can not access this route' });
        }

        if (req.path.startsWith('/users/') && req.params.id) {
            const requestedUserId = parseInt(req.params.id);
            if (requestedUserId !== user.user_id && user.role !== 'admin') {
                return res.status(403).json({ message: 'Forbidden: You can only access your own user data' });
            }
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