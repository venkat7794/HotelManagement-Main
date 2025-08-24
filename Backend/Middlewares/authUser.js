import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};