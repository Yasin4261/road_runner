const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Token'dan kullanıcı bilgisini al
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Lütfen giriş yapın' });
    }
};

module.exports = auth;