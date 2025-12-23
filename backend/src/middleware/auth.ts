import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'No token provided, authorization denied',
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.AUTH_TOKEN_SECRET_KEY || 'default_secret_key') as any;
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      return res.status(401).json({
        message: 'Token is not valid',
        success: false
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token is not valid',
      success: false
    });
  }
};
