const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.login = (req, res) => {
    const { email, password } = req.body;
    // Demo: hardcode tài khoản admin
    if (email === 'admin@example.com' && password === 'admin123') {
        const user = { email, role: 'admin' };
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    // User thường
    if (email === 'user@example.com' && password === 'user123') {
        const user = { email, role: 'user' };
        const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid credentials' });
};