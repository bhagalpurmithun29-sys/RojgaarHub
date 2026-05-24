import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extends Express Request to include authenticated user profiles
export interface AuthRequest extends Request {
  user?: IUser;
}

// Enterprise Role-Based Access Control (RBAC) Permissions Map
export const RolePermissions: Record<string, string[]> = {
  customer: [
    'search_labour', 
    'book_labour', 
    'chat', 
    'call', 
    'payment', 
    'ratings', 
    'wallet_access', 
    'complaint_creation', 
    'sos_usage'
  ],
  labour: [
    'accept_booking', 
    'reject_booking', 
    'manage_schedule', 
    'manage_service_area', 
    'portfolio_management', 
    'withdraw_earnings', 
    'ratings', 
    'sos_usage'
  ],
  contractor: [
    'manage_team', 
    'assign_workers', 
    'bulk_projects', 
    'analytics', 
    'team_ratings'
  ],
  admin: [
    'full_control', 
    'user_management', 
    'booking_management', 
    'payments', 
    'fraud_reports', 
    'audit_logs', 
    'cms', 
    'feature_flags', 
    'analytics', 
    'maintenance_mode'
  ]
};

// @desc    Verify stateless bearer token from headers and attach profile
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');

      const user = await User.findById(decoded.id).select('-passwordHash');
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user profile not found' });
      }
      
      req.user = user;
      return next();
    } catch (error) {
      console.error('🔒 Auth Middleware Verification Fail:', error);
      return res.status(401).json({ message: 'Not authorized, token verification failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// @desc    Restricts access strictly to role types matching input arguments
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ 
      message: `Role (${req.user ? req.user.role : 'none'}) is not authorized to access this resource.` 
    });
  };
};

// @desc    Verifies if authenticated role holds explicit granular permission key
export const checkPermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, profile session not found' });
    }

    const userRole = req.user.role;
    const permissions = RolePermissions[userRole] || [];

    // Admins bypass standard checks via root access
    if (userRole === 'admin' || permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({ 
      message: `Access Denied: Role (${userRole}) lacks the explicit permission '${permission}' required for this action.` 
    });
  };
};
