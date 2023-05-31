import type { NextFunction, Request, Response } from 'express';

export interface MiddlewareModel {
  execute(req: Request, res: Response, next: NextFunction): void;
}
