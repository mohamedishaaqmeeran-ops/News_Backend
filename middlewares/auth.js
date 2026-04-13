const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config');
const User = require('../models/user');

const isAuthenticated = async (req, res, next) => {
    
    const token = req.cookies && req.cookies.token;

    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        
        const decoded = await jwt.verify(token, JWT_SECRET);

      
        req.userId = decoded.userId;

        
        next();
    } catch (error) {
       
        res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

const allowRoles = (roles) => {
    return async (req, res, next) => {
        
        const userId = req.userId;

        
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        
       req.user = user;
req.userId = user._id;
      
        next();
    }
}

module.exports = {
    isAuthenticated,
    allowRoles
}