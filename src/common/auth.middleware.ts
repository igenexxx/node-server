import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';

import type { MiddlewareModel } from './middleware.interface.js';

export class AuthMiddleware implements MiddlewareModel {
  constructor(private secret: string) {}
  execute(req: Request, res: Response, next: NextFunction): void {
    if (req.headers.authorization) {
      const [, token] = req.headers.authorization.split(' ');

      verify(token, this.secret, (err, decoded) => {
        if (err) {
          next();
        } else if (decoded) {
          req.user = (decoded as JwtPayload)?.email;
          next();
        }
      });
    } else {
      next();
    }
  }
}
