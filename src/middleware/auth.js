  // src/middleware/auth.js
  const jwt = require('jsonwebtoken');
  const config = require('../config/config');
  
  const auth = async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        throw new Error();
      }
  
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate.' });
    }
  };
  
  module.exports = auth;