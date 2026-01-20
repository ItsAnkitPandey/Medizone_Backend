import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const fetchuser = (req, res, next) => {
    // Get the user from the JWT token and add id to the req object
    // Support both 'auth-token' header and 'Authorization: Bearer <token>' format
    let token = req.header('auth-token');
    
    if (!token) {
        // Try to get token from Authorization header
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }
    
    if (!token) {
        return res.status(401).send({ message: "Access denied. No token provided." });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        // Catches errors like invalid signature, expired token, etc.
        res.status(401).send({ message: "Access denied. Invalid or expired token." });
    }
};

export default fetchuser;