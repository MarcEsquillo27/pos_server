require('dotenv').config();
const jwt = require('jsonwebtoken');

const verifyToken= (req, res, next) => {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const jwtSecret = process.env.JWT_SECRET || process.env.secret_key;

        if (!jwtSecret) {
            return res.status(503).json({ message: "Authentication is not configured." });
        }

        const decoded = jwt.verify(token, jwtSecret);
        req.userdetails = decoded.userdetails;
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
 };

module.exports = verifyToken;
