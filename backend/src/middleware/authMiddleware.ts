import { Request, Response, NextFunction } from 'express';

export function isAdmin(req: any, res: Response, next: NextFunction) {
  // Only allow the admin to access this route (example: checking email)
  if (req.isAuthenticated() && req.user.emails[0].value === 'onssbenamara3@gmail.com') {
    return next();  // Proceed if the user is an admin
  }
  return res.status(403).json({ message: 'Access forbidden: Admins only' });
}
