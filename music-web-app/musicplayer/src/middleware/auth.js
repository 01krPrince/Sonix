// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const generateToken = (user) => {
//     return jwt.sign(
//         { id: user._id, email: user.email },
//         { expiresIn: '24h' }
//     );
// };

// const hashPassword = async (password) => {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
// };

// const comparePassword = async (password, hashedPassword) => {
//     return await bcrypt.compare(password, hashedPassword);
// };

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'Access denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token.' });
//     }
// };

// module.exports = {
//     generateToken,
//     hashPassword,
//     comparePassword,
//     authenticateToken
// };