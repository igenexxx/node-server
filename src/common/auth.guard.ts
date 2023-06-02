import type { NextFunction, Request, Response } from 'express';

import type { MiddlewareModel } from './middleware.interface.js';

export class AuthGuard implements MiddlewareModel {
  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
